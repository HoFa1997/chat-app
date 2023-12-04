"use client";
import { TChannel } from "@/api";
import { useEffect } from "react";
import { supabaseClient } from "@/api/supabase";
import { useRouter } from "next/navigation";
import { Box, Avatar, ListItem, ListItemAvatar, ListItemText, Typography, Grid } from "@mui/material";
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

  const lastTimUpdated = new Date(data?.last_activity_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <ListItem
      disablePadding
      onClick={() => push(`/${data.id}`)}
      sx={{
        ":hover": { cursor: "pointer", bgcolor: (t) => t.palette.grey[700] },
        p: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
      }}
    >
      <ListItemAvatar>
        <Avatar>
          <ImageIcon />
        </Avatar>
      </ListItemAvatar>

      <Grid container rowSpacing={1}>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Box display="flex" alignContent="center">
            <Typography variant="subtitle1">{data.name}</Typography>
            <Typography variant="subtitle1" marginLeft="auto">
              {lastTimUpdated}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <ListItemText primary={data.last_message_preview ?? "No message"} />
        </Grid>
      </Grid>
    </ListItem>
  );
};
