-- Test
-- SELECT * FROM get_channel_aggregate_data('99634205-5238-4ffc-90ec-c64be3ad25cf');
CREATE OR REPLACE FUNCTION get_channel_aggregate_data(
    input_channel_id VARCHAR(36),
    message_limit INT DEFAULT 20
)
RETURNS TABLE(
    channel_info JSONB,
    last_messages JSONB,
    member_count INT,
    pinned_messages JSONB,
    user_profile JSONB,
    is_user_channel_member BOOLEAN,
    channel_member_info JSONB,
    total_messages_since_last_read INT,
    unread_message BOOLEAN
) AS $$
DECLARE
    channel_result JSONB;
    messages_result JSONB;
    members_result INT;
    pinned_result JSONB;
    user_data_result JSONB;
    is_member_result BOOLEAN;
    channel_member_info_result JSONB;
    last_read_message_id VARCHAR(36);
    last_read_message_timestamp TIMESTAMP WITH TIME ZONE;
    unread_message BOOLEAN := FALSE;
BEGIN
 
-- Get the last_read_message_id for the current user in the channel
    SELECT cm.last_read_message_id INTO last_read_message_id
    FROM public.channel_members cm
    WHERE cm.channel_id = input_channel_id AND cm.member_id = auth.uid();

    -- Get the timestamp of the last read message
    SELECT created_at INTO last_read_message_timestamp
    FROM public.messages
    WHERE id = last_read_message_id;

    -- Count messages since the last read message and adjust message_limit
    SELECT COUNT(*) INTO total_messages_since_last_read
    FROM public.messages 
    WHERE channel_id = input_channel_id 
        AND created_at > COALESCE(last_read_message_timestamp, 'epoch')
        AND deleted_at IS NULL;

   IF total_messages_since_last_read >= message_limit THEN
        message_limit := total_messages_since_last_read;
        unread_message := TRUE;
    END IF;

    -- Query for channel information
    SELECT json_build_object(
               'id', c.id,
               'slug', c.slug,
               'name', c.name,
               'created_by', c.created_by,
               'description', c.description,
               'member_limit', c.member_limit,
               'is_avatar_set', c.is_avatar_set,
               'allow_emoji_reactions', c.allow_emoji_reactions,
               'mute_in_app_notifications', c.mute_in_app_notifications,
               'type', c.type,
               'metadata', c.metadata
           ) INTO channel_result
    FROM public.channels c
    WHERE c.id = input_channel_id;

    -- Query for the last 10 messages with user details, including replied message details
    SELECT json_agg(t) INTO messages_result
    FROM (
        SELECT m.*,
            json_build_object(
                'id', u.id, 
                'username', u.username, 
                'fullname', u.full_name, 
                'avatar_url', u.avatar_url
            ) AS user_details,
            CASE
                WHEN m.reply_to_message_id IS NOT NULL THEN
                    (SELECT json_build_object(
                            'message', json_build_object(
                                'id', rm.id,
                                'created_at', rm.created_at
                            ),
                            'user', json_build_object(
                                'id', ru.id,
                                'username', ru.username,
                                'fullname', ru.full_name,
                                'avatar_url', ru.avatar_url
                            )
                        ) FROM public.messages rm
                        LEFT JOIN public.users ru ON rm.user_id = ru.id
                        WHERE rm.id = m.reply_to_message_id)
                ELSE NULL
            END AS replied_message_details
        FROM public.messages m
        LEFT JOIN public.users u ON m.user_id = u.id
        WHERE m.channel_id = input_channel_id
            AND m.deleted_at IS NULL
            AND (
                CASE
                    WHEN total_messages_since_last_read < 20 THEN TRUE
                    ELSE m.created_at > COALESCE(last_read_message_timestamp, 'epoch')
                END
            )
        ORDER BY m.created_at DESC
        LIMIT message_limit
    ) t;

    IF total_messages_since_last_read <= 0 THEN
        total_messages_since_last_read := message_limit;
    END IF;
        
    -- Query for the count of channel members
    SELECT COUNT(*) INTO members_result
    FROM public.channel_members 
    WHERE channel_id = input_channel_id;

    -- Query for the pinned messages
    SELECT json_agg(pm) INTO pinned_result
    FROM public.pinned_messages pm
    JOIN public.messages m ON pm.message_id = m.id
    WHERE pm.channel_id = input_channel_id;

    -- Query for the user data using auth.uid()
    SELECT json_build_object(
               'id', u.id,
               'username', u.username,
               'full_name', u.full_name,
               'status', u.status,
               'avatar_url', u.avatar_url,
               'email', u.email,
               'website', u.website,
               'about', u.about
           ) INTO user_data_result
    FROM public.users u
    WHERE u.id = auth.uid();

    -- Attempt to get channel member details
    SELECT json_build_object(
            'last_read_message_id', cm.last_read_message_id,
            'last_read_update_at', cm.last_read_update_at,
            'joined_at', cm.joined_at,
            'left_at', cm.left_at,
            'mute_in_app_notifications', cm.mute_in_app_notifications,
            'channel_member_role', cm.channel_member_role,
            'unread_message_count', cm.unread_message_count
        )
    INTO channel_member_info_result
    FROM public.channel_members cm
    WHERE cm.channel_id = input_channel_id AND cm.member_id = auth.uid();

    -- Set is_member_result based on whether channel_member_info_result is null
    is_member_result := (channel_member_info_result IS NOT NULL);

    -- Return the results including the user data
    RETURN QUERY SELECT channel_result, messages_result, members_result, pinned_result, user_data_result, is_member_result, channel_member_info_result, total_messages_since_last_read, unread_message;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------
-- p_message_id =: is the last message inserted in the channel
CREATE OR REPLACE FUNCTION mark_messages_as_read(p_channel_id VARCHAR(36), p_message_id VARCHAR(36))
RETURNS VOID AS $$
DECLARE
    target_timestamp TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get the timestamp of the specified message
    SELECT created_at INTO target_timestamp
    FROM public.messages
    WHERE id = p_message_id;

    -- Check if the target_timestamp is valid (non-NULL)
    IF target_timestamp IS NOT NULL THEN
        -- Update readed_at for messages in the channel not sent by the current user
        UPDATE public.messages
        SET readed_at = now()
        WHERE channel_id = p_channel_id
          AND user_id != auth.uid()
          AND created_at <= target_timestamp
          AND readed_at IS NULL;

        -- Update the last_read_message_id for the current user in the channel_members table
        UPDATE public.channel_members
        SET last_read_message_id = p_message_id, last_read_update_at = now()
        WHERE channel_id = p_channel_id
          AND member_id = auth.uid();
    END IF;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

--------------------------------------------------

CREATE OR REPLACE FUNCTION get_channel_messages_paginated(
    input_channel_id VARCHAR(36),
    page INT,
    page_size INT DEFAULT 20 
)
RETURNS TABLE(
    messages JSONB
) AS $$
DECLARE
    message_offset INT; -- Renamed 'offset' to 'message_offset' to avoid keyword conflict
BEGIN
    -- Calculate the message_offset based on the page number and page size
    message_offset := (page - 1) * page_size;

    -- Query to fetch messages with pagination
    SELECT json_agg(t) INTO messages
    FROM (
        SELECT m.*,
            json_build_object(
                'id', u.id, 
                'username', u.username, 
                'fullname', u.full_name, 
                'avatar_url', u.avatar_url
            ) AS user_details,
            CASE
                WHEN m.reply_to_message_id IS NOT NULL THEN
                    (SELECT json_build_object(
                            'message', json_build_object(
                                'id', rm.id,
                                'created_at', rm.created_at
                            ),
                            'user', json_build_object(
                                'id', ru.id,
                                'username', ru.username,
                                'fullname', ru.full_name,
                                'avatar_url', ru.avatar_url
                            )
                        ) FROM public.messages rm
                        LEFT JOIN public.users ru ON rm.user_id = ru.id
                        WHERE rm.id = m.reply_to_message_id)
                ELSE NULL
            END AS replied_message_details
        FROM public.messages m
        LEFT JOIN public.users u ON m.user_id = u.id
        WHERE m.channel_id = input_channel_id AND m.deleted_at IS NULL
        ORDER BY m.created_at DESC 
        LIMIT page_size OFFSET message_offset
    ) t;

    RETURN QUERY SELECT messages;
END;
$$ LANGUAGE plpgsql;


-- TEST
--- SELECT * FROM get_channel_messages_paginated('<channel_id>', 2, 10);
