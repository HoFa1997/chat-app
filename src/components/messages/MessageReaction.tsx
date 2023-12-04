import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { Stack, IconButton } from "@mui/material";
import { emojiReaction } from "@/api";

import AddReactionIcon from "@mui/icons-material/AddReaction";
const emojis = ["🤦‍♂️", "🤠", "🤬", "🧨", "😎", "👍", "😂", "🤣", "😊", "😇"];

export default function MessageReaction({ message }: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handelEmojiClick = async (emoji: string) => {
    console.info("Emoji clicked", { emoji });
    emojiReaction(message, emoji);
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{ backgroundColor: "transparent", marginRight: "10px" }}
      >
        <AddReactionIcon />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Stack direction="row" spacing={1} style={{ padding: "4px 6px 8px" }}>
          {emojis.map((emoji) => (
            <IconButton
              key={emoji}
              style={{
                fontSize: "1.5rem",
                borderRadius: "50%",
                paddingTop: "4px",
                width: "36px",
                height: "36px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => handelEmojiClick(emoji)}
            >
              <div style={{ marginTop: "6px" }}>{emoji}</div>
            </IconButton>
          ))}
        </Stack>
      </Menu>
    </div>
  );
}
