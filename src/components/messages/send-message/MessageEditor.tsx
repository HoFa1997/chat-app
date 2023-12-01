import BoldIcon from "@mui/icons-material/FormatBoldRounded";
import ItalicIcon from "@mui/icons-material/FormatItalicRounded";
import OrderedListIcon from "@mui/icons-material/FormatListNumberedRounded";
import BulletListIcon from "@mui/icons-material/FormatListBulletedRounded";
import ParagraphIcon from "@mui/icons-material/FormatTextdirectionLToRRounded";
import CodeIcon from "@mui/icons-material/CodeRounded";
import StrikeIcon from "@mui/icons-material/StrikethroughSRounded";
import QuotesIcon from "@mui/icons-material/FormatQuoteRounded";
import UndoIcon from "@mui/icons-material/UndoRounded";
import RedoIcon from "@mui/icons-material/RedoRounded";

import { Editor } from "@tiptap/react";

export const MessageEditor = ({ editor }: { editor: Editor }) => {
  return (
    <div className="bg-menu-background text-primary-text flex flex-row w-full justify-start items-center grow gap-2 py-1 pl-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <BoldIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <ItalicIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <StrikeIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        <ParagraphIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <BulletListIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <OrderedListIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        <CodeIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <QuotesIcon />
      </button>
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
        <UndoIcon />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
        <RedoIcon />
      </button>
    </div>
  );
};
