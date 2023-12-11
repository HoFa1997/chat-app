import React from "react";
import { TMessageWithUser, deleteMessage, pinMessage } from "@/api";
import { TUseContextMenu, setForwardMessage, setReplayMessage } from "@/shared/hooks";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import PinIcon from "@mui/icons-material/PushPinRounded";
import ReplayIcon from "@mui/icons-material/ReplyRounded";
import ForwardIcon from "@mui/icons-material/ForwardRounded";
import { enqueueSnackbar } from "notistack";

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

      // call editor focus
      const event = new CustomEvent("editor:focus");
      document.dispatchEvent(event);

      closeMenu();
    }
  };

  const handleForwardMessage = () => {
    if (messageData) {
      setForwardMessage(messageData);
      closeMenu();
    }
  };

  const handelDeleteMessage = async () => {
    const { error } = await deleteMessage(messageData.channel_id, messageData.id);
    if (!error) {
      enqueueSnackbar("Message deleted", { variant: "success" });
    } else {
      enqueueSnackbar("Message not deleted", { variant: "error" });
    }
    closeMenu();
  };

  const handlePinMessage = async () => {
    const { error } = await pinMessage(messageData.channel_id, messageData.id);
    if (!error) {
      enqueueSnackbar("Message pinned", { variant: "success" });
    } else {
      enqueueSnackbar("Message not pinned", { variant: "error" });
    }
    closeMenu();
  };

  const messageButtonList = [
    { title: "Replay", icon: <ReplayIcon />, onClickFn: handleReplayMessage },
    { title: "Forward", icon: <ForwardIcon />, onClickFn: handleForwardMessage },
    { title: "Pin", icon: <PinIcon />, onClickFn: () => handlePinMessage() },
    { title: "Delete", icon: <DeleteIcon />, onClickFn: () => handelDeleteMessage() },
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
