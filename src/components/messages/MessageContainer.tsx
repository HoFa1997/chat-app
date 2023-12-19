"use stric";

import React, { useState, useRef, useEffect, useMemo, use } from "react";
import { Box } from "@mui/material";
import { MessageHeader } from "./MessageHeader";
import { useChannleInitialData, useMessageSubscription, useScrollAndLoad, useEmojiBoxHandler } from "./hooks";
import {
  ActionBar,
  MessagesDisplay,
  LoadingOverlay,
  EmojiPickerWrapper,
  PinnedMessagesDisplay,
} from "./components/chatContainer";

import { useRouter } from "next/router";

export default function MessageContainer({}: any) {
  const {
    query: { channelId },
  } = useRouter();

  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const [channelUsersPresence, setChannelUsersPresence] = useState(new Map());
  const [pinnedMessages, setPinnedMessages] = useState(new Map());

  const [messages, setMessages] = useState(new Map());
  const [error, setError] = useState(null);
  const [lastMsgUserId, setLastMsgUserId] = useState(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInitialMessagesLoaded(false);
  }, [channelId]);

  // get user session and profile
  // useUserData(setUserSession, setError);
  // get channel initial data, includes pinned messages, last messages and channel members count
  // TODO: we need to consider the last message loaded, and when the user subscribe to the channel, we need to load the messages after the last message loaded
  const { userSession, userProfile, channelInfo, isUserChannelMember, channelMemberInfo } = useChannleInitialData(
    channelId,
    setMessages,
    setPinnedMessages,
    setInitialMessagesLoaded,
    setError,
  );

  useMessageSubscription(
    channelId,
    setMessages,
    messages,
    channelUsersPresence,
    userSession,
    userProfile,
    setChannelUsersPresence,
  );

  const { loading, messageContainerRef, messagesEndRef } = useScrollAndLoad(messages, initialMessagesLoaded, channelId);
  const { isEmojiBoxOpen, closeEmojiPicker, emojiPickerPosition, selectedEmoji, handleEmojiSelect, toggleEmojiPicker } =
    useEmojiBoxHandler(emojiPickerRef, messageContainerRef);

  useEffect(() => {
    console.log({ loading });
  }, [loading]);

  if (error) {
    return <Box>Error loading messages...</Box>;
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
        position: "relative",
      }}
    >
      <MessageHeader channelId={channelId} />
      <PinnedMessagesDisplay pinnedMessages={pinnedMessages} loading={loading} />
      <LoadingOverlay loading={loading} />
      <MessagesDisplay
        messages={messages}
        messageContainerRef={messageContainerRef}
        messagesEndRef={messagesEndRef}
        userSession={userSession}
        lastMsgUserId={lastMsgUserId}
        setLastMsgUserId={setLastMsgUserId}
        toggleEmojiPicker={toggleEmojiPicker}
        selectedEmoji={selectedEmoji}
      />
      <EmojiPickerWrapper
        isEmojiBoxOpen={isEmojiBoxOpen}
        emojiPickerPosition={emojiPickerPosition}
        closeEmojiPicker={closeEmojiPicker}
        handleEmojiSelect={handleEmojiSelect}
        ref={emojiPickerRef}
      />
      <ActionBar
        channelId={channelId}
        userSession={userSession}
        channelInfo={channelInfo}
        channelMemberInfo={channelMemberInfo}
        isUserChannelMember={isUserChannelMember}
      />
    </Box>
  );
}
