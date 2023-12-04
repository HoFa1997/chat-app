"use client";
import { supabaseClient } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import SendIcon from "@mui/icons-material/SendRounded";
import AttachmentIcon from "@mui/icons-material/AttachFileRounded";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { MessageEditor } from "./MessageEditor";
import { ReplayMessage } from "./ReplayMessage";
import { useForwardMessageInfo, useReplayMessageInfo } from "@/shared/hooks";
import { ForwardMessage } from "./ForwardMessage";
import { Box, IconButton } from "@mui/material";
import { TChannel } from "@/api";

type SendMessageProps = {
  channelId: string;
  user: User;
  channels: TChannel[];
};

export default function SendMessage({ channelId, user, channels }: SendMessageProps) {
  const { refresh } = useRouter();
  const replayedMessage = useReplayMessageInfo();
  const forwardedMessage = useForwardMessageInfo();
  const [content, setContent] = useState<string>("");

  const editor = useEditor({
    extensions: [
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
      Placeholder.configure({
        placeholder: "Write a message...",
        showOnlyWhenEditable: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
    editable: true,
  });

  const submit = async () => {
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
        editor?.commands.setContent("");
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#121212",
        borderTop: "2px solid #464646",
      }}
    >
      <ReplayMessage />
      <ForwardMessage channels={channels} user={user} />
      <MessageEditor editor={editor} />
      <Box onKeyDown={(e) => e.key === "Enter" && e.metaKey && submit()} sx={{ width: "100%", px: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: 1,
            bgcolor: "#464646",
            borderRadius: 5,
            mb: 2,
          }}
        >
          <IconButton sx={{ mx: 1 }}>
            <AttachmentIcon />
          </IconButton>

          <EditorContent style={{ width: "100%" }} editor={editor} />

          <IconButton onClick={submit} type="submit" disabled={editor.isEmpty}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
