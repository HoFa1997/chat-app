"use client";
import { TChannel } from "@/api";
import { useEffect } from "react";
import { supabaseClient } from "@/api/supabase";
import { useRouter } from "next/navigation";
import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
export const ChannelItem = ({ data }: { data: TChannel }) => {
  const { refresh, push } = useRouter();

  useEffect(() => {
    const channel = supabaseClient
      .channel("realtime_channels")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "channels",
        },
        () => {
          refresh();
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [refresh]);

  return (
    <ListItem
      sx={{ ":hover": { cursor: "pointer", bgcolor: (t) => t.palette.grey[700] } }}
      disablePadding
      onClick={() => push(`/${data.id}`)}
    >
      <ListItemAvatar>
        <Avatar>
          <ImageIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography>{data.slug}</Typography>
            <Typography>{new Date(data.last_activity_at).toLocaleDateString()}</Typography>
          </Box>
        }
        secondary={
          <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100px",
              }}
            >
              {data.last_message_preview ?? "No message"}
            </Typography>
            <Typography>
              {new Date(data.last_activity_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};
