"use client";
import { TChannel } from "@/api";
import { useEffect } from "react";
import { supabaseClient } from "@/api/supabase";
import { useRouter, useParams } from "next/navigation";
import { Box, Avatar, ListItem, ListItemAvatar, ListItemText, Typography, Grid } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import React from "react";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import CampaignIcon from "@mui/icons-material/Campaign";
import GroupsIcon from "@mui/icons-material/Groups";
import ArchiveIcon from "@mui/icons-material/Archive";
import { grey } from "@mui/material/colors";

const ChannelTypeIcon = ({ channelType }: any) => {
  switch (channelType) {
    case "PUBLIC":
      return (
        <Typography variant="caption">
          <PublicIcon />
        </Typography>
      );
    case "PRIVATE":
      return (
        <Typography variant="caption">
          <LockIcon />
        </Typography>
      );
    case "DIRECT":
      return "";
    case "BROADCAST":
      return (
        <Typography variant="caption">
          <CampaignIcon />
        </Typography>
      );
    case "GROUP":
      return (
        <Typography variant="caption">
          <GroupsIcon />
        </Typography>
      );
    case "ARCHIVE":
      return (
        <Typography variant="caption">
          <ArchiveIcon />
        </Typography>
      );
    default:
      return "";
  }
};

export const ChannelItem = ({ data }: { data: TChannel }) => {
  const { refresh, push } = useRouter();
  const { chatRoomId } = useParams();

  // useEffect(() => {
  //   // const channel = supabaseClient
  //   //   .channel("realtime_channels")
  //   //   .on(
  //   //     "postgres_changes",
  //   //     {
  //   //       event: "*",
  //   //       schema: "public",
  //   //       table: "channels",
  //   //     },
  //   //     () => {
  //   //       // refresh();
  //   //     },
  //   //   )
  //   //   .subscribe();

  //   return () => {
  //     supabaseClient.removeChannel(channel);
  //   };
  // }, [refresh]);

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
        pb: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        borderRadius: "6px",
        backgroundColor: chatRoomId === data.id ? "#6e6e6e" : "",
        marginBottom: "8px",
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: grey[400] }}>
          <ImageIcon />
        </Avatar>
      </ListItemAvatar>

      <Grid container rowSpacing={1}>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Box display="flex" alignContent="center">
            <Typography variant="body1" noWrap={true} display="flex" alignContent="center">
              <ChannelTypeIcon channelType={data.type} />
              <span style={{ marginLeft: "6px" }}>{data.name}</span>
            </Typography>
            <Typography variant="body1" fontSize="0.89rem" marginLeft="auto">
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
