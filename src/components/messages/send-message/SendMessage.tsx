"use client";
import { supabaseClient } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import SendIcon from "@mui/icons-material/SendRounded";
import AttachmentIcon from "@mui/icons-material/AttachFileRounded";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { MessageEditor } from "./MessageEditor";
import { ReplayMessage } from "./ReplayMessage";
import { useForwardMessageInfo, useReplayMessageInfo } from "@/shared/hooks";
import { ForwardMessage } from "./ForwardMessage";

type SendMessageProps = {
  channelId: string;
  user: User;
};

type FromData = { content: string };

export default function SendMessage({ channelId, user }: SendMessageProps) {
  const { refresh } = useRouter();
  const replayedMessage = useReplayMessageInfo();
  const forwardedMessage = useForwardMessageInfo();

  const { handleSubmit, setValue, watch, reset } = useForm<FromData>({
    mode: "onBlur",
    defaultValues: { content: "" },
  });

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Placeholder.configure({
        placeholder: "Write a message...",
        showOnlyWhenEditable: false,
      }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    content: watch("content"),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue("content", html);
    },
    editable: true,
  });

  const submit: SubmitHandler<FromData> = async ({ content }) => {
    const div = document.createElement("div");
    div.innerHTML = content;

    await supabaseClient
      .from("messages")
      .insert({
        content: div.innerText,
        channel_id: channelId,
        user_id: user.id,
        html: content,
        reply_to_message_id: replayedMessage?.id,
        original_message_id: forwardedMessage?.id,
      })
      .select()
      .then(() => {
        reset();
        setValue("content", "");
      });
  };

  useEffect(() => {
    const channel = supabaseClient
      .channel("realtime_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => refresh(),
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [refresh]);

  if (!editor) return null;

  return (
    <div className="flex flex-col items-center justify-between  border-l-[1px] border-background">
      <ReplayMessage />
      <ForwardMessage />
      <MessageEditor editor={editor} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex w-full flex-row items-end bg-menu-background px-2 pb-1 text-primary-text"
      >
        <button>
          <AttachmentIcon className="h-7 w-7 transition-all hover:fill-background" />
        </button>

        <EditorContent
          className="flex max-h-[150px] min-h-[35px] grow flex-col items-start justify-end overflow-auto px-2"
          editor={editor}
        />

        <button type="submit">
          <SendIcon className="h-7 w-7 transition-all hover:fill-background" />
        </button>
      </form>
    </div>
  );
}
