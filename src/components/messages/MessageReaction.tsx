import React, { useEffect, useState, useCallback } from "react";
import { IconButton } from "@mui/material";
import { emojiReaction } from "@/api";

import AddReactionIcon from "@mui/icons-material/AddReaction";

export default function MessageReaction({ message }: any) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openEmojiPicker = useCallback((clickEvent: any) => {
    const event = new CustomEvent("toggelEmojiPicker", {
      detail: { clickEvent: clickEvent, message, type: "react2Message" },
    });
    document.dispatchEvent(event);
  }, []);

  const handelEmojiClick = async (emoji: string) => {
    console.info("Emoji clicked", { emoji });
    emojiReaction(message, emoji);
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={openEmojiPicker}
      >
        <AddReactionIcon />
      </IconButton>
    </div>
  );
}
