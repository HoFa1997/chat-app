import BoldIcon from "@mui/icons-material/FormatBoldRounded";
import ItalicIcon from "@mui/icons-material/FormatItalicRounded";
import OrderedListIcon from "@mui/icons-material/FormatListNumberedRounded";
import BulletListIcon from "@mui/icons-material/FormatListBulletedRounded";
import CodeIcon from "@mui/icons-material/CodeRounded";
import StrikeIcon from "@mui/icons-material/StrikethroughSRounded";
import QuotesIcon from "@mui/icons-material/FormatQuoteRounded";
import UndoIcon from "@mui/icons-material/UndoRounded";
import RedoIcon from "@mui/icons-material/RedoRounded";

import { Editor } from "@tiptap/react";
import { Box, IconButton as MuiIcon, styled } from "@mui/material";

const IconButton = styled(MuiIcon)(({}) => ({
  background: "#464646",
  width: 32,
  height: 32,
}));

export const MessageEditor = ({ editor }: { editor: Editor }) => {
  return (
    <Box
      sx={{
        bgcolor: "menuBackground",
        color: "primaryText",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        flexGrow: 1,
        gap: 1,
        pt: 1,
        pb: 2,
        pl: 2,
      }}
    >
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        sx={{ bgcolor: (t) => (editor.isActive("bold") ? t.palette.grey[500] : "") }}
      >
        <BoldIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        sx={{ bgcolor: (t) => (editor.isActive("italic") ? t.palette.grey[500] : "") }}
      >
        <ItalicIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        sx={{ bgcolor: (t) => (editor.isActive("strike") ? t.palette.grey[500] : "") }}
      >
        <StrikeIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        sx={{ bgcolor: (t) => (editor.isActive("bulletList") ? t.palette.grey[500] : "") }}
      >
        <BulletListIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        sx={{ bgcolor: (t) => (editor.isActive("orderedList") ? t.palette.grey[500] : "") }}
      >
        <OrderedListIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        sx={{ bgcolor: (t) => (editor.isActive("codeBlock") ? t.palette.grey[500] : "") }}
      >
        <CodeIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        sx={{ bgcolor: (t) => (editor.isActive("blockquote") ? t.palette.grey[500] : "") }}
      >
        <QuotesIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <UndoIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <RedoIcon />
      </IconButton>
    </Box>
  );
};
