"use client";
import { useEffect, useState } from "react";
import { TChannel, getChannelById } from "@/api";
import { Avatar, Box, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
type SendMessageProps = { channelId: string };

export const MessageHeader = ({ channelId }: SendMessageProps) => {
  const [channelData, setChannelData] = useState<TChannel | null>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const { data: channel } = await getChannelById(channelId);
        setChannelData(channel);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };

    fetchChannelData();
  }, [channelId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: (t) => t.palette.background.paper,
        borderTop: "2px solid #464646",
        px: 2,
        py: 1,
      }}
    >
      <Avatar>
        <ImageIcon />
      </Avatar>
      <Typography ml={3} flexGrow={1} variant="h6" sx={{ ml: 2 }}>
        {channelData?.name}
      </Typography>
    </Box>
  );
};
