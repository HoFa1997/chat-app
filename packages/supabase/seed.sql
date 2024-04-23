-- Custom types

-- Define various permissions for app functionality.
-- This includes creating, deleting, and editing channels and messages,
-- as well as viewing, editing, and deleting users, and creating, editing, and deleting roles.
create type public.app_permission as enum (
  'channels.create', 'channels.delete', 'channels.edit',
  'messages.create', 'messages.delete', 'messages.edit',
  'users.view', 'users.edit', 'users.delete',
  'roles.create', 'roles.edit', 'roles.delete'
);

-- Define roles within the app.
-- 'admin' has the highest level of access,
-- 'moderator' has limited administrative capabilities,
-- 'member' is a standard user role,
-- 'guest' has restricted access, usually for temporary or limited users.
create type public.app_role as enum ('admin', 'moderator', 'member', 'guest');

-- Define the status of the users.
-- 'ONLINE' indicates the user is actively using the app,
-- 'OFFLINE' indicates the user is not currently using the app,
-- 'AWAY' signifies the user is temporarily away,
-- 'BUSY' shows the user is occupied and might not respond promptly,
-- 'INVISIBLE' allows users to use the app without appearing online.
create type public.user_status as enum ('ONLINE', 'OFFLINE', 'AWAY', 'BUSY', 'INVISIBLE');

-- Define the types of messages that can be sent.
-- 'text' is a standard text message,
-- 'image' is a message with an image attachment,
-- 'video' is a message with a video attachment,
-- 'audio' is a message with an audio attachment.
create type public.message_type as enum ('text', 'image', 'video', 'audio', 'link', 'giphy', 'file', 'notification');


-- NOTE: The following types are not currently used in the schema.
-- Define the types of notifications that can be sent.
create type public.notification_type as enum (
  'message', 'channel_invite', 'mention', 'reply', 'thread_update',
  'channel_update', 'member_join', 'member_leave', 'user_activity',
  'task_assignment', 'event_reminder', 'system_update', 'security_alert',
  'like_reaction', 'feedback_request', 'performance_insight'
);

-- Type: public.channel_type
-- Description: Enumeration of different types of channels supported in the application.
-- Each type defines the purpose and accessibility of the channel.

CREATE TYPE public.channel_type AS ENUM
(
    'PUBLIC',     -- PUBLIC: Open for all users. Any user of the application can join and participate.
    'PRIVATE',    -- PRIVATE: Restricted access. Users can join only by invitation or approval.
    'BROADCAST',  -- BROADCAST: One-way communication channel where selected users can post, but all users can view.
    'ARCHIVE',    -- ARCHIVE: Read-only channel for historical/reference purposes. No new messages can be posted.
    'DIRECT',     -- DIRECT: One-on-one private conversation between two users.
    'GROUP'       -- GROUP: For a specific set of users, typically used for group discussions or team collaborations.
);

COMMENT ON TYPE public.channel_type IS 'Defines the types of channels available in the application, each with specific accessibility and interaction rules.';

-- Type: public.channel_member_role
-- Description: Enumeration of different roles that a member can have within a channel.
CREATE TYPE public.channel_member_role AS ENUM (
    'MEMBER',    -- Regular member with standard privileges.
    'ADMIN',     -- Administrator with elevated privileges like managing channel settings and members.
    'MODERATOR', -- Moderator with privileges like moderating content and managing user interactions.
    'GUEST'      -- Guest with limited privileges, typically read-only access.
);

COMMENT ON TYPE public.channel_member_role IS 'Defines the roles of channel members, determining their privileges and access within the channel.';

-- Create the enumeration type for notification categories
CREATE TYPE notification_category AS ENUM (
    'mention',
    'message',
    'reply',
    'reaction',
    'thread_message',
    'channel_event',
    'direct_message',
    'invitation',
    'system_alert'
);

-- COMMENT ON TYPE notification_category IS 'Enumeration of different types of notifications in the application, categorizing the context and purpose of each notification.';


-- Table: public.users
-- Description: This table holds essential information about each user within the application. 
-- It includes user identification, personal and contact details, and system-related information.
CREATE TABLE public.users (
    id              UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username        TEXT NOT NULL UNIQUE,      -- The username chosen by the user, ensured to be unique across the system.
    full_name       TEXT,               -- Full name of the user.
    display_name    TEXT,              -- Display name of the user.
    status      user_status DEFAULT 'OFFLINE'::public.user_status,  -- Current online/offline status of the user. Defaults to 'OFFLINE'.
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL, -- Timestamp of the last update, automatically set to the current UTC time.
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL, -- Timestamp of the user's creation, automatically set to the current UTC time.
    avatar_url  TEXT,               -- URL of the user's avatar image.
    website     TEXT,               -- User's personal or professional website.
    email       TEXT UNIQUE,        -- User's email address.
    job_title   TEXT NULL,
    company     TEXT NULL,
    about       TEXT,               -- Brief description or bio of the user.
    CONSTRAINT username_length CHECK (char_length(username) >= 3), -- Ensures that usernames are at least 3 characters long.
    last_seen_at TIMESTAMP WITH TIME ZONE  -- Timestamp of the last time the user was seen online.
);

-- Table: public.channels
-- Description: Represents various channels in the application, similar to chat rooms or discussion groups.
-- Channels have attributes like privacy settings, member limits, activity timestamps, and user interaction settings.
CREATE TABLE public.channels (
    id                              VARCHAR(36) DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    workspace_id                    VARCHAR(36) NOT NULL REFERENCES public.workspaces,
    created_at                      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at                      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    slug                            TEXT NOT NULL UNIQUE,
    name                            TEXT NOT NULL CHECK (length(name) <= 100),
    created_by                      UUID NOT NULL REFERENCES public.users,
    description                     TEXT CHECK (length(description) <= 1000),
    member_limit                    INT,
    last_activity_at                TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    last_message_preview            TEXT,
    is_avatar_set                   BOOLEAN DEFAULT false,
    allow_emoji_reactions           BOOLEAN DEFAULT true, -- Indicates if emoji reactions are allowed in the channel.
    mute_in_app_notifications       BOOLEAN DEFAULT false, -- Indicates if notifications are muted for the channel.
    type                            channel_type DEFAULT 'PUBLIC'::public.channel_type,
    metadata                        JSONB DEFAULT '{}'::jsonb
);

-- Constraint: check_slug_format
ALTER TABLE public.channels ADD CONSTRAINT check_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

COMMENT ON TABLE public.channels IS 'This table contains information about various channels used for group discussions and messaging in the application, including settings for user interactions and notifications.';


-- Table: public.messages
-- Description: Stores all messages exchanged in the application. This includes various types of messages like text, image, video, or audio. 
-- The table also tracks message status (edited, deleted) and associations (user, channel, replies, and forwardings).
CREATE TABLE public.messages (
    id                     VARCHAR(36) DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at             TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL, -- Creation timestamp of the message.
    updated_at             TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL, -- Last update timestamp of the message.
    deleted_at             TIMESTAMP WITH TIME ZONE, -- Timestamp for when the message was marked as deleted.
    edited_at              TIMESTAMP WITH TIME ZONE, -- Timestamp for when the message was edited.
    content                TEXT CHECK (length(content) <= 3000),  -- The actual text content of the message.
    html                   TEXT CHECK (length(html) <= 3000), -- The actual HTML content of the message.
    medias                 JSONB, -- Stores URLs to media (images, videos, etc.) associated with the message.
    user_id                UUID NOT NULL REFERENCES public.users, -- The ID of the user who sent the message.
    channel_id             VARCHAR(36) NOT NULL REFERENCES public.channels ON DELETE SET NULL, -- The ID of the channel where the message was sent.
    reactions              JSONB, -- JSONB field storing user reactions to the message.
    type                   message_type, -- Enumerated type of the message (text, image, video, etc.).
    metadata               JSONB, -- Additional metadata about the message in JSONB format.
    reply_to_message_id    VARCHAR(36) REFERENCES public.messages(id) ON DELETE SET NULL, -- The ID of the message this message is replying to, if any.
    replied_message_preview TEXT, -- Preview text of the message being replied to.
    origin_message_id      VARCHAR(36) REFERENCES public.messages(id) ON DELETE SET NULL, -- ID of the original message if this is a forwarded message.
    thread_id              VARCHAR(36) REFERENCES public.messages(id) ON DELETE SET NULL, -- ID of the thread this message belongs to.
    thread_depth           INT DEFAULT 0, -- Depth of the message in the thread.
    is_thread_root         BOOLEAN DEFAULT false, -- Indicates if the message is the root of a thread.
    thread_owner_id   UUID REFERENCES public.users ON DELETE SET NULL, -- ID of the user who owns/opens the thread.
    readed_at              TIMESTAMP WITH TIME ZONE, -- Timestamp for when the message was read by a user.
);

COMMENT ON TABLE public.messages IS 'Contains individual messages sent by users, including their content, type, and associated metadata.';


-- Table: public.channel_members
-- Description: Manages the membership of users within channels. This table tracks which messages each user has read in a channel, 
-- enabling the application to maintain an up-to-date read status. This is crucial for message-based applications where read receipts are important.
CREATE TABLE public.channel_members (
    channel_id            VARCHAR(36) NOT NULL REFERENCES public.channels ON DELETE CASCADE, -- The ID of the channel. If the channel is deleted, associated member records are also deleted.
    member_id             UUID NOT NULL REFERENCES public.users ON DELETE CASCADE, -- The ID of the channel member (user). If the user is deleted, their membership records are also deleted.
    last_read_message_id  UUID REFERENCES public.messages, -- The ID of the last message read by the user in the channel. Helps in tracking read status.
    last_read_update_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()), -- Timestamp when the user's last read status was updated.
    joined_at             TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL, -- Timestamp when the user joined the channel.
    left_at               TIMESTAMP WITH TIME ZONE, -- Timestamp when the user left the channel.
    mute_in_app_notifications BOOLEAN DEFAULT false, -- Indicates if notifications are muted for the channel.
    channel_member_role   channel_member_role DEFAULT 'MEMBER'::public.channel_member_role, -- The role of the user in the channel (e.g., admin, moderator, member).
    unread_message_count  INT DEFAULT 0, -- The number of unread messages for the user in the channel.
    created_at            TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL, -- Timestamp when the membership record was created.
    updated_at            TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()), -- Timestamp when the membership record was last updated.
    PRIMARY KEY (channel_id, member_id) -- Composite primary key to ensure unique membership records for each channel.
);

CREATE OR REPLACE FUNCTION update_last_read_time()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.last_read_message_id IS DISTINCT FROM NEW.last_read_message_id THEN
        NEW.last_read_update_at := timezone('utc', now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_read_time
BEFORE UPDATE ON public.channel_members
FOR EACH ROW
EXECUTE FUNCTION update_last_read_time();

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
