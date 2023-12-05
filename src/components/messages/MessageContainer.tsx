"use client";

import { useEffect, useState, useRef } from "react";
import MessageCard from "./MessageCard";
import { Box, CircularProgress, Chip, Typography } from "@mui/material";
import { MessageHeader } from "./MessageHeader";
import { ChannelActionBar } from "./components/ChannelActionBar";
import {
  useUserData,
  useChannelData,
  useMessagesData,
  useChannelMemmberData,
  useMessageSubscription,
  useChannelMemberSubscription,
} from "./hooks";

export default function MessageContainer({ channelId }: any) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channelMembers, setChannelMembers] = useState(new Map());
  const messagesEndRef = useRef(null);

  const { channelInfo } = useChannelData(channelId, user, setError, setLoading);
  useUserData(setUser, setError);
  useMessagesData(channelId, setMessages, setError, setLoading);
  const { isChannelMember, setIsChannelMember } = useChannelMemmberData(
    channelId,
    user,
    setError,
    setLoading,
    setChannelMembers,
  );
  useMessageSubscription(channelId, setMessages, messages, channelMembers);
  useChannelMemberSubscription(channelId, channelMembers, setChannelMembers, user, setIsChannelMember);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading || !user) {
    return <CircularProgress />;
  }

  if (error) {
    return <Box>Error loading messages...</Box>;
  }

  if ((channelInfo?.type === "PRIVATE" || channelInfo?.type === "DIRECT") && !isChannelMember) {
    if (!isChannelMember) {
      return (
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            backgroundImage: "url(/bg-chat.webp)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <MessageHeader channelId={channelId} />
          <Box display="flex" alignItems="center" height="100vh" justifyContent="center" flexGrow={1}>
            <Chip label={<Typography variant="body2">You are not a member of this channel!</Typography>} />
          </Box>
        </Box>
      );
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        backgroundImage: "url(/bg-chat.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <MessageHeader channelId={channelId} />
      {messages.size === 0 ? (
        <Box display="flex" alignItems="center" height="100vh" justifyContent="center" flexGrow={1}>
          <Chip label={<Typography variant="body2">No messages yet!</Typography>} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", overflowY: "auto", scrollbarWidth: "none" }}>
          {[...messages.values()].map((item, index, array) => (
            <MessageCard
              key={item.id}
              data={item}
              user={user}
              ref={index === array.length - 1 ? messagesEndRef : null}
            />
          ))}
        </Box>
      )}

      <div style={{ marginTop: "auto" }}>
        <ChannelActionBar channelId={channelId} user={user} channelInfo={channelInfo} channelMembers={channelMembers} />
      </div>
    </Box>
  );
}
