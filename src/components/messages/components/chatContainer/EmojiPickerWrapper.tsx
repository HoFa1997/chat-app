import React from "react";
import { Box } from "@mui/material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export const EmojiPickerWrapper = React.forwardRef(
  ({ isEmojiBoxOpen, emojiPickerPosition, closeEmojiPicker, handleEmojiSelect }: any, ref: any) => {
    return (
      <Box
        id="emoji_picker"
        sx={{
          position: "fixed",
          top: `${emojiPickerPosition.top}px`,
          left: `${emojiPickerPosition.left}px`,
          visibility: isEmojiBoxOpen ? "visible" : "hidden",
          zIndex: 999,
        }}
        ref={ref}
      >
        <Picker data={data} onClickOutside={closeEmojiPicker} onEmojiSelect={handleEmojiSelect} />
      </Box>
    );
  },
);

EmojiPickerWrapper.displayName = "EmojiPickerWrapper";
