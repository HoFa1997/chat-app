-----------------------------------------
-----------------------------------------

CREATE OR REPLACE FUNCTION handle_set_thread_depth()
RETURNS TRIGGER AS $$
DECLARE
    parent_thread_depth INT;
BEGIN
    -- Check if the new message has a thread_id and retrieve the thread_depth of the parent message
    SELECT thread_depth INTO parent_thread_depth FROM public.messages WHERE id = NEW.thread_id;

    -- Set the thread_depth of the new message if parent_thread_depth is not null
    IF parent_thread_depth IS NOT NULL THEN
        NEW.thread_depth := parent_thread_depth + 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_thread_depth
BEFORE INSERT ON public.messages
FOR EACH ROW
WHEN (NEW.thread_id IS NOT NULL)
EXECUTE FUNCTION handle_set_thread_depth();

-----------------------------------------
-----------------------------------------
CREATE OR REPLACE FUNCTION create_thread_message(
    p_content TEXT,
    p_channel_id VARCHAR(36),
    p_user_id UUID,
    p_html TEXT,
    p_thread_id VARCHAR(36)
)
RETURNS VOID AS $$
DECLARE
    owner_exists BOOLEAN;
BEGIN
    -- Check if the provided thread_id has a thread_owner_id
    SELECT EXISTS (
        SELECT 1 FROM public.messages 
        WHERE id = p_thread_id 
          AND is_thread_root = TRUE 
          AND thread_owner_id IS NOT NULL
    ) INTO owner_exists;

    -- If no thread owner exists, set the current user as the thread owner
    IF NOT owner_exists THEN
        UPDATE public.messages
        SET thread_owner_id = auth.uid(), -- Setting current user as the thread owner
            is_thread_root = TRUE
        WHERE id = p_thread_id;
    END IF;

    -- Insert the new message into the messages table
    INSERT INTO public.messages (
        content,
        channel_id,
        user_id,
        html,
        thread_id
    )
    VALUES (
        p_content,
        p_channel_id,
        p_user_id,
        p_html,
        p_thread_id
    );

END;
$$ LANGUAGE plpgsql;

-----------------------------------------
-----------------------------------------

CREATE OR REPLACE FUNCTION increment_thread_message_count()
RETURNS TRIGGER AS $$
DECLARE
    root_id VARCHAR;
    current_metadata JSONB;
BEGIN
    -- Find the root message ID from the thread_id of the newly inserted message
    IF NEW.thread_id IS NOT NULL THEN
        root_id := NEW.thread_id;

        -- Retrieve current metadata or initialize if null
        SELECT metadata INTO current_metadata FROM public.messages WHERE id = root_id;
        IF current_metadata IS NULL THEN
            current_metadata := '{}'::jsonb;
        END IF;

        -- Ensure 'thread' object exists, initialize if not
        IF NOT (current_metadata ? 'thread') THEN
            current_metadata := jsonb_build_object('thread', jsonb_build_object('message_count', 0));
        END IF;

        -- Increment the message_count
        current_metadata := jsonb_set(current_metadata, '{thread, message_count}', 
            ((current_metadata->'thread'->>'message_count')::int + 1)::text::jsonb, true);

        -- Update the root message's metadata
        UPDATE public.messages
        SET metadata = current_metadata
        WHERE id = root_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_increment_thread_message_count
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION increment_thread_message_count();

-----------------------------------------
-----------------------------------------
CREATE OR REPLACE FUNCTION decrement_thread_message_count()
RETURNS TRIGGER AS $$
DECLARE
    root_id VARCHAR;
    current_metadata JSONB;
BEGIN
    -- Check for the root message ID from the thread_id of the message being deleted or soft-deleted
    IF OLD.thread_id IS NOT NULL AND OLD.deleted_at IS NOT NULL THEN
        root_id := NEW.thread_id;
        
        -- Retrieve current metadata or initialize if null
        SELECT metadata INTO current_metadata FROM public.messages WHERE id = root_id;
        IF current_metadata IS NULL THEN
            current_metadata := '{}'::jsonb;
        END IF;

        -- Ensure 'thread' object exists, initialize if not
        IF NOT (current_metadata ? 'thread') THEN
            current_metadata := jsonb_build_object('thread', jsonb_build_object('message_count', 1));  -- Default to 1 to avoid negative counts
        END IF;

        -- Decrement the message_count but do not go below zero
        current_metadata := jsonb_set(current_metadata, '{thread, message_count}', 
            GREATEST((current_metadata->'thread'->>'message_count')::int - 1, 0)::text::jsonb, true);

        -- Update the root message's metadata
        UPDATE public.messages
        SET metadata = current_metadata
        WHERE id = root_id;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_decrement_thread_message_count
AFTER UPDATE OF deleted_at ON public.messages
FOR EACH ROW
WHEN (OLD.thread_id IS NOT NULL AND NEW.deleted_at IS NOT NULL)
EXECUTE FUNCTION decrement_thread_message_count();

-----------------------------------------
-----------------------------------------

CREATE OR REPLACE FUNCTION soft_delete_thread_messages()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the message is the root of a thread and has been soft-deleted
    IF NEW.is_thread_root = TRUE AND NEW.deleted_at IS NOT NULL THEN
        -- Soft delete all messages in the thread
        UPDATE public.messages
        SET deleted_at = NEW.deleted_at
        WHERE thread_id = NEW.thread_id
          AND id <> NEW.id; -- Exclude the root message as it's already being updated
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_soft_delete_thread_messages
AFTER UPDATE OF deleted_at ON public.messages
FOR EACH ROW
WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
EXECUTE FUNCTION soft_delete_thread_messages();
