import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./EditorToolbar";
import { ReplayMessageIndicator } from "./ReplayMessageIndicator";
import { useReplayMessageInfo, setReplayMessage, useEditeMessageInfo, setEditeMessage } from "@/shared/hooks";
import { useState, useCallback, useEffect, useMemo } from "react";
import Mention from "@tiptap/extension-mention";
import suggestion from "./suggestion";
import { twx, cn } from "@utils/index";
import { ImAttachment } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { MdFormatColorText } from "react-icons/md";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { useStore, useAuthStore } from "@stores/index";
import { sendMessage, updateMessage } from "@/api";
import { useApi } from "@/shared/hooks/useApi";
import toast from "react-hot-toast";
import { EditeMessageIndicator } from "./EditeMessageIndicator";
type BtnIcon = React.ComponentProps<"button"> & { $active?: boolean; $size?: number };

const IconButton = twx.button<BtnIcon>((prop) =>
  cn(
    "btn btn-ghost w-8 h-8 btn-xs p-1 mr-2",
    prop.$active && "btn-active",
    prop.$size && `w-${prop.$size} h-${prop.$size}`,
  ),
);

export default function SendMessage() {
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [showEditorToolbar, setShowEditorToolbar] = useState(false);

  const user = useAuthStore((state: any) => state.profile);
  const { channelId } = useStore((state: any) => state.workspaceSettings);
  const setOrUpdateUserPresence = useStore((state: any) => state.setOrUpdateUserPresence);
  const usersPresence = useStore((state: any) => state.usersPresence);
  const replayedMessage = useReplayMessageInfo();
  const editeMessage = useEditeMessageInfo();

  const { request: postRequestMessage, loading: postMsgLoading } = useApi(sendMessage, null, false);
  const { request: editeRequestMessage, loading: editMsgLoading } = useApi(updateMessage, null, false);

  const loading = useMemo(() => {
    return postMsgLoading || editMsgLoading;
  }, [postMsgLoading, editMsgLoading]);

  const editor: Editor | null = useEditor(
    {
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
      editorProps: {
        handleKeyDown: (view, event) => {
          if (event.key === "Enter" && event.metaKey) {
            return true; // Indicates that this key event was handled
          }
          // Return false to let other keydown handlers (or TipTap defaults) process the event
          return false;
        },
      },
    },
    [],
  );

  useEffect(() => {
    if (!editor) return;
    // custom event listener, to handle focus on editor
    const handleFocus = () => {
      editor.commands.focus();
    };
    document.addEventListener("editor:focus", handleFocus);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    editor
      .chain()
      .insertContent(editeMessage?.html || editeMessage?.content || "", {
        parseOptions: {
          preserveWhitespace: false,
        },
      })
      .focus("end")
      .run();
  }, [editor, editeMessage]);

  const submit = useCallback(async () => {
    if (!html || !text || loading) return;

    if (replayedMessage?.id) {
      const user = replayedMessage.user_details;
      if (!usersPresence.has(user.id)) setOrUpdateUserPresence(user.id, user);
    }

    if (editeMessage?.id) {
      const user = editeMessage.user_details;
      if (!usersPresence.has(user.id)) setOrUpdateUserPresence(user.id, user);
    }

    const messageId = editeMessage?.id || replayedMessage?.id || null;

    try {
      editor?.commands.clearContent(true);

      if (editeMessage) {
        await editeRequestMessage(text, html, messageId);
      } else {
        await postRequestMessage(text, channelId, user.id, html, messageId);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      // clear the editor
      if (replayedMessage) document.dispatchEvent(new CustomEvent("messages:container:scroll:down"));
    }

    // if it has reply or forward message, clear it
    if (replayedMessage) setReplayMessage(null);
    if (editeMessage) setEditeMessage(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, text, html]);

  const openEmojiPicker = (clickEvent: any) => {
    const event = new CustomEvent("toggelEmojiPicker", {
      detail: { clickEvent: clickEvent, editor, type: "inserEmojiToEditor" },
    });
    document.dispatchEvent(event);
  };

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!loading);
  }, [loading, editor]);

  // Handler for the ESC key
  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (replayedMessage) setReplayMessage(null);
        if (editeMessage) {
          setEditeMessage(null);
          editor?.commands.clearContent(true);
        }
      }
    },
    [replayedMessage, editeMessage],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleEsc]);

  if (!editor || !user) return null;

  return (
    <div className="flex w-full flex-col bg-base-200 p-1 px-2 pb-0 ">
      <ReplayMessageIndicator />
      <EditeMessageIndicator />
      <EditorToolbar editor={editor} className=" px-2" style={{ display: showEditorToolbar ? "flex" : "none" }} />

      <div
        className={`my-2 mt-1 w-full px-2${showEditorToolbar ? 0 : 2}`}
        onKeyDown={(e) => e.key === "Enter" && (e.metaKey || e.ctrlKey) && submit()}
      >
        <div className="flex w-full flex-col rounded-md bg-base-300 px-3">
          <div className="flex items-center py-2 text-base">
            <IconButton $size={8}>
              <ImAttachment size={20} />
            </IconButton>

            <EditorContent style={{ width: "100%" }} editor={editor} dir="auto" />

            <IconButton $size={8} onClick={() => setShowEditorToolbar(!showEditorToolbar)}>
              <MdFormatColorText size={22} />
            </IconButton>

            <IconButton $size={8} onClick={openEmojiPicker}>
              <BsFillEmojiSmileFill size={22} />
            </IconButton>

            <IconButton $size={8} onClick={submit} type="submit" disabled={loading || editor.isEmpty}>
              <IoSend size={22} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
