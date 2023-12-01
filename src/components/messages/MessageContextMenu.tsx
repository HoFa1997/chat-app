import React from "react";
import { TMessageWithUser } from "@/api";
import { TUseContextMenu, setForwardMessage, setReplayMessage } from "@/shared/hooks";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import PinIcon from "@mui/icons-material/PushPinRounded";
import ReplayIcon from "@mui/icons-material/ReplyRounded";
import ForwardIcon from "@mui/icons-material/ForwardRounded";

export const MessageContextMenu = ({
  props: { menuRef, menuState, closeMenu },
  messageData,
}: {
  props: TUseContextMenu;
  messageData: TMessageWithUser;
}) => {
  const handleReplayMessage = () => {
    if (messageData) {
      setReplayMessage(messageData);
      closeMenu();
    }
  };

  const handleForwardMessage = () => {
    if (messageData) {
      setForwardMessage(messageData);
      closeMenu();
    }
  };

  const messageButtonList = [
    { title: "Replay", icon: <ReplayIcon />, onClickFn: handleReplayMessage },
    { title: "Forward", icon: <ForwardIcon />, onClickFn: handleForwardMessage },
    { title: "Pin", icon: <PinIcon />, onClickFn: () => closeMenu() },
    { title: "Delete", icon: <DeleteIcon />, onClickFn: () => closeMenu() },
  ];

  return (
    <Menu
      ref={menuRef}
      open={menuState.visible}
      onClose={closeMenu}
      anchorReference="anchorPosition"
      anchorPosition={{ top: menuState.y, left: menuState.x }}
    >
      {messageButtonList.map((item) => (
        <MenuItem key={item.title} onClick={item.onClickFn}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </MenuItem>
      ))}
    </Menu>
  );
};
