import React, { useState, useRef, useEffect } from "react";
import { MessageHeader } from "./MessageHeader";
import ScrollToBottomButton from "./components/chatContainer/ScrollToBottomButton"; // Import the new component
import {
  useChannelInitialData,
  useMessageSubscription,
  useScrollAndLoad,
  useEmojiBoxHandler,
  useCustomEventHandler,
  useInfiniteLoadMessages,
  useChatContainerResizeHandler,
} from "./hooks";
import {
  ActionBar,
  MessagesDisplay,
  LoadingOverlay,
  EmojiPickerWrapper,
  PinnedMessagesDisplay,
} from "./components/chatContainer";
import { twx } from "@utils/index";
import { ThreadHeader } from "./components/threads/ThreadHeader";
import { useStore } from "@stores/index";
import ThreadMessageCard from "./components/chatContainer/ThreadMessageCard";
const MessageWrapper = twx.div`relative flex h-dvh w-full items-center justify-center bg-base-300`;

import { useResizeChannelList } from "@/components/channel/useResizeChannelList";

import { ThreadContainer } from "./ThreadContainer";

export default function MessageContainer({}: any) {
  const [channelUsersPresence, setChannelUsersPresence] = useState(new Map());
  const [error, setError] = useState(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const startThreadMessage = useStore((state) => state.startThreadMessage);

  // get user session and profile
  // get channel initial data, includes pinned messages, last messages and channel members count
  // TODO: we need to consider the last message loaded, and when the user subscribe to the channel, we need to load the messages after the last message loaded
  const { initialMessagesLoading, msgLength } = useChannelInitialData(setError);

  const { initialSubscribeLoading } = useMessageSubscription();
  const { loading, messagesEndRef } = useScrollAndLoad(
    initialMessagesLoading,
    messageContainerRef,
    msgLength,
  );
  const {
    isEmojiBoxOpen,
    closeEmojiPicker,
    emojiPickerPosition,
    selectedEmoji,
    handleEmojiSelect,
    toggleEmojiPicker,
  } = useEmojiBoxHandler(emojiPickerRef, messageContainerRef);

  useCustomEventHandler(
    channelUsersPresence,
    setChannelUsersPresence,
    messageContainerRef,
    messagesEndRef,
  );
  const { isLoadingMore } = useInfiniteLoadMessages(messageContainerRef);
  const { onMouseDown, leftWidth, panelRef } = useChatContainerResizeHandler();

  if (error) {
    return (
      <MessageWrapper>
        <div className="badge badge-error">Error loading messages...</div>
      </MessageWrapper>
    );
  }

  if (initialSubscribeLoading || initialMessagesLoading)
    return (
      <MessageWrapper className="flex-col justify-start">
        <LoadingOverlay loading={true} />
      </MessageWrapper>
    );

  return (
    <div className="w-full flex" ref={panelRef}>
      <MessageWrapper style={{ width: `${leftWidth}%` }} className="flex-col justify-start">
        <MessageHeader />
        <PinnedMessagesDisplay loading={loading} />
        <LoadingOverlay loading={loading} />
        <MessagesDisplay
          messageContainerRef={messageContainerRef}
          messagesEndRef={messagesEndRef}
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
        <ActionBar />
        <ScrollToBottomButton messagesContainer={messageContainerRef} />
        <div
          className="absolute right-0 top-0 h-full hover:bg-base-100 transition-all w-1 cursor-ew-resize select-none bg-base-300"
          onMouseDown={onMouseDown}
          data-limit
        />
      </MessageWrapper>
      <ThreadContainer leftWidth={leftWidth} />
    </div>
  );
}
