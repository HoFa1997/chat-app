"use client";
import { logout } from "@/api";
import { Avatar, Box, IconButton, Menu, MenuItem, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetUserSession, useGetUserId, useProfileModal } from "@/shared/hooks";

export const UserInfoCard = () => {
  const { refresh } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userId = useGetUserId();
  const { user } = useGetUserSession({ userId });

  const { ModalComponent, profileModal, setProfileModal } = useProfileModal({ user });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    refresh();
  };

  const handelOpenProfileModal = () => {
    handleClose();
    setProfileModal(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h6">Chats</Typography>

      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
        <Typography variant="body2" mr={1}>
          {user?.email ? user.email : <Skeleton variant="text" width={100} />}
        </Typography>

        <IconButton onClick={handleClick}>
          {user?.avatar_url ? (
            <Avatar alt="Avatar" src={user.avatar_url} />
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )}
        </IconButton>
      </Box>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handelOpenProfileModal}>Profile</MenuItem>
        <MenuItem onClick={() => {}}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      {profileModal && <ModalComponent />}
    </Box>
  );
};
