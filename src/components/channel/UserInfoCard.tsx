"use client";
import { logout } from "@/api";
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
type UserInfoCardProps = {
  userData: User;
};

export const UserInfoCard = ({ userData: user }: UserInfoCardProps) => {
  const { refresh, push } = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    push("/login");
    refresh();
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h6">Chats</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
        <Typography variant="body2" mr={1}>
          {user?.email}
        </Typography>
        <IconButton onClick={handleClick}>
          {user ? <Avatar alt="Avatar" src={user.user_metadata.avatar_url} /> : null}
        </IconButton>
      </Box>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => {}}>Profile</MenuItem>
        <MenuItem onClick={() => {}}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};
