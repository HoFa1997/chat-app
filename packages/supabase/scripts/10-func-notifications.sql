-- TODO: what if in the reply we have @mention, @everyone, or reactions?

CREATE OR REPLACE FUNCTION create_notifications_for_new_message() RETURNS TRIGGER AS $$
DECLARE
    mentioned_user_id UUID;
    channel_member RECORD;
    pattern TEXT;
    mention_found BOOLEAN := FALSE;
    is_channel_muted BOOLEAN;
    truncated_content TEXT;

BEGIN
    -- Check if notifications are muted for the channel
    SELECT mute_in_app_notifications INTO is_channel_muted FROM public.channels WHERE id = NEW.channel_id;
    IF is_channel_muted THEN
        RETURN NEW; -- Exit if notifications are muted for the channel
    END IF;

    truncated_content := truncate_content(NEW.content);

    -- Handle '@username' mention
    pattern := '@([a-zA-Z0-9_]+)';
    FOR mentioned_user_id IN
        SELECT u.id FROM public.users u
        WHERE u.username = substring(NEW.content FROM pattern)
    LOOP
        mention_found := TRUE;
        -- Check if the mentioned user has muted notifications
        IF (SELECT mute_in_app_notifications FROM public.channel_members WHERE channel_id = NEW.channel_id AND member_id = mentioned_user_id) = FALSE THEN
            INSERT INTO public.notifications (receiver_user_id, sender_user_id, type, message_id, channel_id, message_preview, created_at)
            VALUES (mentioned_user_id, NEW.user_id, 'mention', NEW.id, NEW.channel_id, truncated_content, NOW());
        END IF;
    END LOOP;

    -- Handle '@everyone' mention, but exclude the sender
    IF NEW.content LIKE '%@everyone%' THEN
        mention_found := TRUE;
        FOR channel_member IN SELECT cm.member_id FROM public.channel_members cm WHERE cm.channel_id = NEW.channel_id AND cm.member_id != NEW.user_id LOOP
            -- Check if the channel member has muted notifications
            IF (SELECT mute_in_app_notifications FROM public.channel_members WHERE channel_id = NEW.channel_id AND member_id = channel_member.member_id) = FALSE THEN
                INSERT INTO public.notifications (receiver_user_id, sender_user_id, type, message_id, channel_id, message_preview, created_at)
                VALUES (channel_member.member_id, NEW.user_id, 'channel_event', NEW.id, NEW.channel_id, truncated_content, NOW());
            END IF;
        END LOOP;
    END IF;


    -- If no mentions (like '@username' or '@everyone') are found in the message,
    -- then this block creates notifications for channel members. Two types of notifications are created:
    -- 1. 'reply' type for the user who is the owner of the original message being replied to.
    -- 2. 'message' type for all other channel members.
    -- These notifications are only created for channel members who have not muted in-app notifications
    -- and who are not the sender of the new message.
    IF NOT mention_found THEN
        INSERT INTO public.notifications (receiver_user_id, sender_user_id, type, message_id, channel_id, message_preview, created_at)
        SELECT 
            cm.member_id, 
            NEW.user_id,
            CASE 
                WHEN NEW.thread_id IS NOT NULL THEN 'thread_message'::notification_category
                WHEN NEW.reply_to_message_id IS NOT NULL AND m.user_id = cm.member_id THEN 'reply'::notification_category
                ELSE 'message'::notification_category
            END, 
            NEW.id, 
            NEW.channel_id, 
            truncated_content, 
            NOW()
        FROM public.channel_members cm
        LEFT JOIN public.messages m ON m.id = NEW.reply_to_message_id
        WHERE cm.channel_id = NEW.channel_id AND cm.member_id != NEW.user_id AND cm.mute_in_app_notifications = FALSE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_on_new_message_for_notifications
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION create_notifications_for_new_message();

-----------------------------------------

CREATE OR REPLACE FUNCTION create_notifications_for_new_unique_reactions() RETURNS TRIGGER AS $$
DECLARE
    reaction_key TEXT;
    new_reaction_entry JSONB;
    reaction_exists BOOLEAN;
BEGIN
    -- Loop through each reaction type key in the updated reactions JSONB
    FOR reaction_key IN SELECT jsonb_object_keys(NEW.reactions)
    LOOP
        -- Loop through each JSON object in the new reactions array for this key
        FOR new_reaction_entry IN SELECT jsonb_array_elements(NEW.reactions -> reaction_key)
        LOOP
            -- Assume the reaction is new until found in the old reactions
            reaction_exists := FALSE;

            -- Check if this reaction entry is already in the old reactions
            IF OLD.reactions ? reaction_key THEN
                reaction_exists := EXISTS (
                    SELECT 1 
                    FROM jsonb_array_elements(OLD.reactions -> reaction_key) AS old_entry
                    WHERE (old_entry ->> 'user_id') = (new_reaction_entry ->> 'user_id')
                );
            END IF;

            -- If the reaction is new, create a notification
            IF NOT reaction_exists THEN
                INSERT INTO public.notifications (receiver_user_id, sender_user_id, type, message_id, channel_id, message_preview, created_at)
                VALUES (OLD.user_id, NEW.user_id, 'reaction', NEW.id, NEW.channel_id, truncate_content(NEW.content), NOW());
            END IF;
        END LOOP;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_on_reaction_update_for_notifications
AFTER UPDATE OF reactions ON public.messages
FOR EACH ROW
WHEN (OLD.reactions IS DISTINCT FROM NEW.reactions)
EXECUTE FUNCTION create_notifications_for_new_unique_reactions();


/*
    --------------------------------------------------------
    Function: increment_unread_count_on_new_message
    Description: Increments the unread message count for each channel member when a new message is posted.
                 The count is incremented only for members who have not read messages up to the time of the new message.
    --------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION increment_unread_count_on_new_message() RETURNS TRIGGER AS $$
DECLARE
    channel_member RECORD;
BEGIN
    -- Iterate through each member of the channel, excluding the sender
    FOR channel_member IN
        SELECT cm.member_id, cm.last_read_update_at
        FROM public.channel_members cm 
        WHERE cm.channel_id = NEW.channel_id AND cm.member_id != NEW.user_id
    LOOP
        -- Increment unread message count if the new message was sent after the last read update
        IF NEW.created_at > channel_member.last_read_update_at THEN
            UPDATE public.channel_members
            SET unread_message_count = unread_message_count + 1
            WHERE channel_id = NEW.channel_id AND member_id = channel_member.member_id;
        END IF;
    END LOOP;

    RETURN NEW; -- Return the new message record
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION increment_unread_count_on_new_message() IS 'Function to increment unread message count for channel members upon the insertion of a new message, provided the message was posted after the member’s last read update.';

/*
    --------------------------------------------------------
    Trigger: increment_unread_count_after_new_message
    Description: Triggered after a new message is inserted. Calls the 
                 increment_unread_count_on_new_message function to update unread message counts
                 for members in the message's channel.
    --------------------------------------------------------
*/

CREATE TRIGGER increment_unread_count_after_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION increment_unread_count_on_new_message();

COMMENT ON TRIGGER increment_unread_count_after_new_message ON public.messages IS 'Trigger to increment unread message count for channel members in the channel_members table after a new message is posted.';




CREATE OR REPLACE FUNCTION decrement_unread_message_count() RETURNS TRIGGER AS $$
DECLARE
    channel_member RECORD;
    notification_count INT;
    channel_id_used VARCHAR(36);
BEGIN
    -- Determine whether it's a soft delete (update) or hard delete
    IF TG_OP = 'DELETE' THEN
        channel_id_used := OLD.channel_id;
    ELSE
        channel_id_used := NEW.channel_id;
    END IF;

    -- Decrement unread message count for channel members
    FOR channel_member IN SELECT * FROM public.channel_members WHERE channel_id = channel_id_used LOOP
        -- Count the notifications associated with the message for this particular user
        SELECT COUNT(*) INTO notification_count 
        FROM public.notifications 
        WHERE receiver_user_id = channel_member.member_id AND channel_id = channel_id_used AND read_at IS NULL;

        UPDATE public.channel_members
        SET unread_message_count = notification_count
        WHERE channel_id = channel_id_used AND member_id = channel_member.member_id;
    END LOOP;

    RETURN NULL; -- Return value is not used for AFTER triggers
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER decrement_unread_message_count_trigger_soft_delete
AFTER UPDATE OF deleted_at ON public.messages
FOR EACH ROW
WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
EXECUTE FUNCTION decrement_unread_message_count();

CREATE TRIGGER decrement_unread_message_count_trigger_hard_delete
AFTER DELETE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION decrement_unread_message_count();
