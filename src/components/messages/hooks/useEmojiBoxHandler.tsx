import { useState, useCallback, useEffect, useMemo, use } from "react";
import { emojiReaction } from "@/api";

export const useEmojiBoxHandler = (emojiPikerRef: any) => {
  const [isEmojiBoxOpen, setIsEmojiBoxOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, left: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [eventTypes, setEventTypes] = useState(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    document.addEventListener("toggelEmojiPicker", (e: any) => {
      const event = e.detail.clickEvent;
      const message = e.detail?.message;
      const type = e.detail.type;
      const editor = e.detail?.editor;
      setEditor(editor);
      setEventTypes(type);
      const { clientHeight, clientWidth } = emojiPikerRef.current;

      // we need to pick up these dynamic values from the DOM
      const emojiButtonWidth = 24;
      const chatEditorHeight = 153;

      // Use getBoundingClientRect if positioning relative to an element
      const rect = event.currentTarget.getBoundingClientRect();
      let newTop = rect.bottom + window.scrollY;
      let newLeft = rect.left + window.scrollX;

      // Adjust for right and bottom edges
      if (newLeft + clientWidth + emojiButtonWidth > window.innerWidth) {
        newLeft = newLeft - clientWidth;
      }
      if (newTop + clientHeight + chatEditorHeight > window.innerHeight) {
        newTop = newTop - clientHeight;
      }

      // Adjust for top and left edges
      newTop = Math.max(0, newTop);
      newLeft = Math.max(0, newLeft);

      setEmojiPickerPosition({ top: newTop, left: newLeft });
      setIsEmojiBoxOpen(!isEmojiBoxOpen);
      setSelectedMessage(message);
    });
  }, []);

  const openEmojiPicker = useCallback(() => {
    setIsEmojiBoxOpen(true);
  }, [isEmojiBoxOpen]);

  const closeEmojiPicker = useCallback(() => {
    if (isEmojiBoxOpen) setIsEmojiBoxOpen(false);
  }, [isEmojiBoxOpen]);

  const handleEmojiSelect = useCallback(
    (emoji: any) => {
      if (!isEmojiBoxOpen) return;
      setSelectedEmoji(emoji);
      if (eventTypes === "react2Message") {
        emojiReaction(selectedMessage, emoji.native);
      }
      if (eventTypes === "inserEmojiToEditor") {
        editor?.chain().focus().insertContent(emoji.native).run();
      }
      closeEmojiPicker();
    },
    [isEmojiBoxOpen],
  );

  const toggleEmojiPicker = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const { clientHeight, clientWidth } = emojiPikerRef.current;

      // we need to pick up these dynamic values from the DOM
      const emojiButtonWidth = 24;
      const chatEditorHeight = 153;

      // Use getBoundingClientRect if positioning relative to an element
      const rect = event.currentTarget.getBoundingClientRect();
      let newTop = rect.bottom + window.scrollY;
      let newLeft = rect.left + window.scrollX;

      // Adjust for right and bottom edges
      if (newLeft + clientWidth + emojiButtonWidth > window.innerWidth) {
        newLeft = newLeft - clientWidth;
      }
      if (newTop + clientHeight + chatEditorHeight > window.innerHeight) {
        newTop = newTop - clientHeight;
      }

      // Adjust for top and left edges
      newTop = Math.max(0, newTop);
      newLeft = Math.max(0, newLeft);

      setEmojiPickerPosition({ top: newTop, left: newLeft });
      setIsEmojiBoxOpen(!isEmojiBoxOpen);
    },
    [isEmojiBoxOpen],
  );

  return {
    isEmojiBoxOpen,
    openEmojiPicker,
    closeEmojiPicker,
    selectedEmoji,
    handleEmojiSelect,
    toggleEmojiPicker,
    emojiPickerPosition,
  };
};