CREATE TABLE public.thread_participants (
    thread_id          VARCHAR(36) NOT NULL REFERENCES public.threads(thread_id),
    user_id            UUID NOT NULL REFERENCES public.users(id),
    joined_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    user_avatar_url    TEXT,
    PRIMARY KEY (thread_id, user_id)
);
