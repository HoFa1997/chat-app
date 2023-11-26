"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { useState } from "react";
import { BoldIcon } from "@/shared/assets";

export const Tiptap = () => {
  const [content, setContent] = useState("<p>Hello World! 🌎️</p>");

  const editor = useEditor({
    extensions: [Document, Paragraph, Text, Bold],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const toggleBold = () => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  };

  return (
    <div className="w-full h-full select-none">
      <button className="border-0 border-gray-200" onClick={toggleBold}>
        <BoldIcon />
      </button>
      <EditorContent editor={editor} />
    </div>
  );
};
