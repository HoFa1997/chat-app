-----------------------------------------

CREATE OR REPLACE FUNCTION handle_open_a_thread()
RETURNS TRIGGER AS $$
BEGIN
    NEW.is_thread_root := TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_open_a_thread_update
BEFORE UPDATE ON public.messages
FOR EACH ROW
WHEN (NEW.thread_owner_user_id IS NOT NULL)
EXECUTE FUNCTION handle_open_a_thread();


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
