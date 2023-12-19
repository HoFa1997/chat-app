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

import { supabaseClient } from "@/api/supabase";

import { useRouter } from "next/router";
import { Coming_Soon } from "next/font/google";

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
  const [isSubscribe, setIsSubscribe] = useState(false);

  const [currentPage, setCurrentPage] = useState(2);
  const pageSize = 10; // Set the page size as needed
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

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
    setIsSubscribe,
  );

  const { loading, messageContainerRef, messagesEndRef } = useScrollAndLoad(
    messages,
    initialMessagesLoaded,
    channelId,
    isSubscribe,
  );
  const { isEmojiBoxOpen, closeEmojiPicker, emojiPickerPosition, selectedEmoji, handleEmojiSelect, toggleEmojiPicker } =
    useEmojiBoxHandler(emojiPickerRef, messageContainerRef);

  useEffect(() => {
    if (messagesEndRef.current) {
      document.addEventListener("messages:container:scroll:down", () => {
        // ensure the message append to the end of the list
        setTimeout(() => {
          const container = messagesEndRef.current as Element;
          container && container.scrollIntoView({ behavior: "smooth" });
        }, 500);
      });
    }
  }, [messageContainerRef, messages]);

  const fetchMessages = async (channelId, pageNumber, pageSize) => {
    try {
      let { data, error, status } = await supabaseClient
        .rpc("get_channel_messages_paginated", {
          input_channel_id: channelId,
          page: pageNumber,
          page_size: pageSize,
        })
        .single();

      if (error && status !== 406) throw error;

      return data;
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      return null;
    }
  };

  const getFirstVisibleMessage = () => {
    const current = messageContainerRef.current;
    if (!current) return null;

    const messagesElements = current.children;
    for (let i = 0; i < messagesElements.length; i++) {
      const messageEl = messagesElements[i];
      const messageTop = messageEl.offsetTop;
      const messageBottom = messageTop + messageEl.offsetHeight;

      if (messageTop >= current.scrollTop && messageBottom <= current.scrollTop + current.offsetHeight) {
        return messageEl;
      }
    }
    return null;
  };

  /* eslint-disable */
  const loadMoreMessages = async () => {
    if (!hasMoreMessages || !messageContainerRef.current) return;

    const firstVisibleMessage = getFirstVisibleMessage() as HTMLElement;
    const prevTop = firstVisibleMessage ? firstVisibleMessage?.offsetTop : 0;

    const pageMessages = (await fetchMessages(channelId, currentPage, pageSize)) as any;

    if (pageMessages?.messages && pageMessages?.messages?.length > 0) {
      // Convert pageMessages.messages to a Map
      const newMessagesMap: any = new Map(pageMessages.messages.reverse().map((message: any) => [message.id, message]));

      // Merge the new messages with the existing ones
      const updatedMessages = new Map([...newMessagesMap, ...messages.entries()]);

      setMessages(updatedMessages);
      setCurrentPage(currentPage + 1);

      // Adjust the scroll position
      requestAnimationFrame(() => {
        if (messageContainerRef.current && firstVisibleMessage) {
          const currentTop = firstVisibleMessage.offsetTop;
          messageContainerRef.current.scrollTop += currentTop - prevTop;
        }
      });
    } else {
      setHasMoreMessages(false);
    }
  };
  /* eslint-enable */

  useEffect(() => {
    const handleScroll = () => {
      const current = messageContainerRef.current;
      if (current) {
        const isAtTop = current.scrollTop == 0;
        if (isAtTop) loadMoreMessages();
      }
    };

    const currentRef = messageContainerRef.current;
    currentRef?.addEventListener("scroll", handleScroll);

    return () => {
      currentRef?.removeEventListener("scroll", handleScroll);
    };
  }, [messageContainerRef, messages]);

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
