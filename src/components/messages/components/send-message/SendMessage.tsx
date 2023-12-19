"use client";
import { supabaseClient } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import SendIcon from "@mui/icons-material/SendRounded";
import AttachmentIcon from "@mui/icons-material/AttachFileRounded";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./EditorToolbar";
import { ReplayMessage } from "./ReplayMessage";
import { useForwardMessageInfo, useReplayMessageInfo, setReplayMessage } from "@/shared/hooks";
import { ForwardMessage } from "./ForwardMessage";
import { Box, IconButton } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import Mention from "@tiptap/extension-mention";
import suggestion from "./suggestion";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

type SendMessageProps = {
  channelId: string;
  user: User;
};

export default function SendMessage({ channelId, user }: SendMessageProps) {
  const replayedMessage = useReplayMessageInfo();
  const forwardedMessage = useForwardMessageInfo();
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [showEditorToolbar, setShowEditorToolbar] = useState(true);
  // return <>editor</>;

  const editor: Editor | null = useEditor({
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
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion,
      }),
      Placeholder.configure({
        placeholder: "Write a message...",
        showOnlyWhenEditable: false,
      }),
    ],
    onUpdate: ({ editor }) => {
      setHtml(editor?.getHTML());
      setText(editor?.getText());
    },
    editable: true,
  });

  useEffect(() => {
    if (!editor) return;
    // custom event listener, to handle focus on editor
    const handleFocus = () => {
      editor.commands.focus();
    };
    document.addEventListener("editor:focus", handleFocus);
  }, [editor]);

  const submit = useCallback(async () => {
    if (!html || !text) return;
    console.log({
      channelId,
    });
    await supabaseClient
      .from("messages")
      .insert({
        content: text,
        channel_id: channelId,
        user_id: user.id,
        html,
        reply_to_message_id: replayedMessage?.id,
        origin_message_id: forwardedMessage?.id,
      })
      .select()
      .then(() => {
        editor?.commands.clearContent(true);
      })
      .catch((err) => {
        console.log({ err, channelId });
      });
    // if it has reply or forward message, clear it
    if (replayedMessage) setReplayMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, text, html]);

  const openEmojiPicker = (clickEvent: any) => {
    const event = new CustomEvent("toggelEmojiPicker", {
      detail: { clickEvent: clickEvent, editor, type: "inserEmojiToEditor" },
    });
    document.dispatchEvent(event);
  };

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
      <ForwardMessage user={user} />
      <EditorToolbar
        editor={editor}
        sx={{
          display: showEditorToolbar ? "flex" : " none",
          p: 1,
          px: 2,
        }}
      />

      <Box
        onKeyDown={(e) => e.key === "Enter" && e.metaKey && submit()}
        sx={{ width: "100%", px: 2, mb: 2, mt: showEditorToolbar ? 0 : 2 }}
      >
        <Box
          sx={{
            bgcolor: "#464646",
            borderRadius: "6px",
            px: "10px",
            pb: 0,
            pt: 0,
          }}
        >
          <Box sx={{ py: 1 }}>
            <EditorContent style={{ width: "100%" }} editor={editor} dir="auto" />
          </Box>

          <Box width="100%" display="flex">
            <IconButton sx={{ mx: 1, margin: 0 }}>
              <AttachmentIcon color="action" />
            </IconButton>

            <IconButton sx={{ mx: 1, margin: 0 }} onClick={() => setShowEditorToolbar(!showEditorToolbar)}>
              <TextFormatIcon color="action" />
            </IconButton>

            <IconButton sx={{ mx: 1, margin: 0 }} onClick={openEmojiPicker}>
              <SentimentSatisfiedAltIcon color="action" />
            </IconButton>

            <IconButton onClick={submit} sx={{ marginLeft: "auto" }} type="submit" disabled={editor.isEmpty}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
