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
import SendMessage from "./components/send-message/SendMessage";
const MessageWrapper = twx.div`relative flex h-dvh w-full items-center justify-center bg-base-300`;

import { ThreadMessagesDisplay } from "./components/chatContainer/ThreadMessagesDisplay";

export const ThreadContainer = ({ leftWidth }: any) => {
  const startThreadMessage = useStore((state) => state.startThreadMessage);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  if (!startThreadMessage) return;

  return (
    <MessageWrapper
      style={{ width: `${100 - leftWidth}%` }}
      className="flex-col justify-start bg-base-200"
    >
      <ThreadHeader />
      {/* show the message that start thread from */}
      {/* Then other messages */}
      <div className="relative msg_wrapper flex w-full flex-col px-2 pt-1 ">
        <ThreadMessageCard data={startThreadMessage} />
      </div>

      <div className="divider"></div>

      <ThreadMessagesDisplay messageContainerRef={messageContainerRef} />
      {/* <ActionBar className="mt-0" /> */}
      <SendMessage thread={true} />
    </MessageWrapper>
  );
};
