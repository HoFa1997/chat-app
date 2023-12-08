import BoldIcon from "@mui/icons-material/FormatBoldRounded";
import ItalicIcon from "@mui/icons-material/FormatItalicRounded";
import OrderedListIcon from "@mui/icons-material/FormatListNumberedRounded";
import BulletListIcon from "@mui/icons-material/FormatListBulletedRounded";
import CodeIcon from "@mui/icons-material/CodeRounded";
import StrikeIcon from "@mui/icons-material/StrikethroughSRounded";
import QuotesIcon from "@mui/icons-material/FormatQuoteRounded";
import UndoIcon from "@mui/icons-material/UndoRounded";
import RedoIcon from "@mui/icons-material/RedoRounded";
import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { Box, IconButton as MuiIcon, styled, Divider } from "@mui/material";

const IconButton = styled(MuiIcon)(({}) => ({
  // background: "#464646",
  borderRadius: 2,
  width: 32,
  height: 32,
}));

export const EditorToolbar = ({ editor, sx }: { editor: Editor; sx: any }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Update the focus state based on editor's events
  useEffect(() => {
    const updateFocus = () => setIsFocused(editor.isFocused);
    editor.on("focus", updateFocus);
    editor.on("blur", updateFocus);

    // Cleanup
    return () => {
      editor.off("focus", updateFocus);
      editor.off("blur", updateFocus);
    };
  }, [editor]);

  // Function to determine the background color based on the state and editor's isActive method
  const getBackgroundColor = (condition: any) => {
    if (!isFocused) {
      return "grey.700"; // Replace with your desired color when not focused
    }
    return condition ? "grey.500" : "";
  };

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
        ...sx,
      }}
    >
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        sx={{ bgcolor: (t) => (editor.isActive("bold") ? t.palette.grey[100] : "") }}
      >
        <BoldIcon sx={{ color: getBackgroundColor(editor.isActive("bold")) }} />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        sx={{ bgcolor: (t) => (editor.isActive("italic") ? t.palette.grey[100] : "") }}
      >
        <ItalicIcon sx={{ color: getBackgroundColor(editor.isActive("italic")) }} />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        sx={{ bgcolor: (t) => (editor.isActive("strike") ? t.palette.grey[100] : "") }}
      >
        <StrikeIcon sx={{ color: getBackgroundColor(editor.isActive("strike")) }} />
      </IconButton>
      <Divider orientation="vertical" flexItem />
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        sx={{ bgcolor: (t) => (editor.isActive("bulletList") ? t.palette.grey[100] : "") }}
      >
        <BulletListIcon sx={{ color: getBackgroundColor(editor.isActive("bulletList")) }} />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        sx={{ bgcolor: (t) => (editor.isActive("orderedList") ? t.palette.grey[100] : "") }}
      >
        <OrderedListIcon sx={{ color: getBackgroundColor(editor.isActive("orderedList")) }} />
      </IconButton>
      <Divider orientation="vertical" flexItem />

      <IconButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        sx={{ bgcolor: (t) => (editor.isActive("codeBlock") ? t.palette.grey[100] : "") }}
      >
        <CodeIcon sx={{ color: getBackgroundColor(editor.isActive("codeBlock")) }} />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        sx={{ bgcolor: (t) => (editor.isActive("blockquote") ? t.palette.grey[100] : "") }}
      >
        <QuotesIcon sx={{ color: getBackgroundColor(editor.isActive("blockquote")) }} />
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
