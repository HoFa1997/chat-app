"use client";
import { TChannel } from "@/api";
import { useEffect } from "react";
import { supabaseClient } from "@/api/supabase";
import { useRouter } from "next/navigation";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import React from "react";
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
      onClick={() => push(`/${data.id}`)}
      alignItems="flex-start"
      sx={{ ":hover": { cursor: "pointer", bgcolor: (t) => t.palette.grey[700] } }}
    >
      <ListItemAvatar>
        <Avatar>
          <ImageIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={data.slug}
        secondary={
          <React.Fragment>
            {/* <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
              Ali Connors
            </Typography> */}
            {data.last_message_preview ?? "No message"}
          </React.Fragment>
        }
      />
    </ListItem>
  );
};
