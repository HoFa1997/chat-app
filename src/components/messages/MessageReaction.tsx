import React, { useCallback } from "react";
import { IconButton } from "@mui/material";

import AddReactionIcon from "@mui/icons-material/AddReaction";

export default function MessageReaction({ message }: any) {
  const openEmojiPicker = useCallback((clickEvent: any) => {
    const event = new CustomEvent("toggelEmojiPicker", {
      detail: { clickEvent: clickEvent, message, type: "react2Message" },
    });
    document.dispatchEvent(event);
  }, []);

  return (
    <div>
      <IconButton onClick={openEmojiPicker}>
        <AddReactionIcon />
      </IconButton>
    </div>
  );
}
