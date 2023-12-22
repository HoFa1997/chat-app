"use stric";

import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { MessageHeader } from "./MessageHeader";
import {
  useChannleInitialData,
  useMessageSubscription,
  useScrollAndLoad,
  useEmojiBoxHandler,
  useCustomEventHandler,
  useInfiniteLoadMessages,
} from "./hooks";
import {
  ActionBar,
  MessagesDisplay,
  LoadingOverlay,
  EmojiPickerWrapper,
  PinnedMessagesDisplay,
} from "./components/chatContainer";
import { useRouter } from "next/router";

export default function MessageContainer({}: any) {
  const router = useRouter();
  const channelId = router.query.channelId as string;

  const [channelUsersPresence, setChannelUsersPresence] = useState(new Map());
  const [messages, setMessages] = useState(new Map());
  const [error, setError] = useState(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  // get user session and profile
  // useUserData(setUserSession, setError);
  // get channel initial data, includes pinned messages, last messages and channel members count
  // TODO: we need to consider the last message loaded, and when the user subscribe to the channel, we need to load the messages after the last message loaded
  const {
    pinnedMessages,
    initialMessagesLoaded,
    userSession,
    userProfile,
    channelInfo,
    isUserChannelMember,
    channelMemberInfo,
  } = useChannleInitialData(channelId, setMessages, setError);

  const { isSubscribe } = useMessageSubscription(
    channelId,
    setMessages,
    messages,
    channelUsersPresence,
    userSession,
    userProfile,
    setChannelUsersPresence,
  );

  const { loading, messageContainerRef, messagesEndRef } = useScrollAndLoad(
    messages,
    initialMessagesLoaded,
    channelId,
    isSubscribe,
  );

  const { isEmojiBoxOpen, closeEmojiPicker, emojiPickerPosition, selectedEmoji, handleEmojiSelect, toggleEmojiPicker } =
    useEmojiBoxHandler(emojiPickerRef, messageContainerRef);

  useCustomEventHandler(channelUsersPresence, setChannelUsersPresence, messageContainerRef, messagesEndRef, messages);
  const { isLoadingMore } = useInfiniteLoadMessages(channelId, messageContainerRef, messages, setMessages);

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
        toggleEmojiPicker={toggleEmojiPicker}
        selectedEmoji={selectedEmoji}
        isLoadingMore={isLoadingMore}
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
