import React, { useState, useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import { format, isSameDay, parseISO } from "date-fns";
import { useStore } from "@stores/index";
import { useCheckReadMessage } from "../../hooks";

interface ThreadMessagesDisplayProps {
  messageContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  toggleEmojiPicker: any;
  selectedEmoji: any; // Update the type based on your emoji implementation
  isLoadingMore: boolean;
}

const isNewDay = (currentMessageDate: string, previousMessageDate: string) => {
  return !isSameDay(parseISO(currentMessageDate), parseISO(previousMessageDate));
};

const DateChip: React.FC<{ date: string; isScrollingUp: boolean }> = ({ date, isScrollingUp }) => (
  <div
    className="date_chip relative z-10 my-2 flex w-full justify-center pt-2"
    style={{ position: isScrollingUp ? "sticky" : "relative", top: isScrollingUp ? 0 : undefined }}
  >
    <div className="badge relative z-10 bg-base-100">{format(parseISO(date), "MMMM do, yyyy")}</div>
  </div>
);

const NoThreadMessagesDisplay = () => (
  <div className="flex h-dvh items-center justify-center">
    <div className="badge badge-neutral">No messages yet!</div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center pt-2">
    <span className="loading loading-spinner text-primary"></span>
  </div>
);

const SystemNotifyChip: React.FC<{ message: string }> = ({ message }) => (
  <div className="my-4 flex justify-center pb-1">
    <div className="badge badge-secondary">{message}</div>
  </div>
);

const generateMessageElements = (
  messages: Map<string, any>,
  isScrollingUp: boolean,
  messagesEndRef: React.RefObject<HTMLDivElement>,
  toggleEmojiPicker: any,
  selectedEmoji: string,
) => {
  const messagesArray = Array.from(messages.values());
  const lastReadMessageId = useStore.getState().workspaceSettings.lastReadMessageId;
  const totalMsgSincLastRead = useStore.getState().workspaceSettings.totalMsgSincLastRead || 0;

  return messagesArray.flatMap((message, index, array) => {
    const elements = [];

    if (lastReadMessageId === message.id && totalMsgSincLastRead >= 6) {
      elements.push(
        <div key={index + "2"} className="divider my-2 w-full p-4">
          Unread messages
        </div>,
      );
    }

    if (index === 0 || isNewDay(message.created_at, array[index - 1]?.created_at)) {
      elements.push(
        <DateChip
          key={message.created_at}
          date={message.created_at}
          isScrollingUp={isScrollingUp}
        />,
      );
    }

    if (message.type === "notification") {
      elements.push(<SystemNotifyChip key={message.id} message={message.content} />);
    } else {
      elements.push(
        <MessageCard
          key={message.id}
          data={message}
          ref={index === array.length - 1 ? messagesEndRef : null}
          toggleEmojiPicker={toggleEmojiPicker}
          selectedEmoji={selectedEmoji}
        />,
      );
    }

    return elements;
  });
};

export const ThreadMessagesDisplay: React.FC<ThreadMessagesDisplayProps> = ({
  messageContainerRef,
  messagesEndRef,
  toggleEmojiPicker,
  selectedEmoji,
  isLoadingMore,
}) => {
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollTop = useRef(0);
  const { channelId } = useStore((state: any) => state.workspaceSettings);
  const startThreadMessage = useStore((state) => state.startThreadMessage);
  const messages = useStore((state: any) =>
    state.threadMessages.get(startThreadMessage?.thread_id),
  );

  // mark as read message
  useCheckReadMessage({ messageContainerRef, channelId, messages });

  if (!messages || messages.size === 0) {
    return <NoThreadMessagesDisplay />;
  }

  return (
    <>
      <div
        className="relative msg_wrapper flex w-full  flex-col overflow-y-auto px-4 pt-1"
        ref={messageContainerRef}
      >
        {isLoadingMore && <LoadingSpinner />}
        {generateMessageElements(
          messages,
          isScrollingUp,
          messagesEndRef,
          toggleEmojiPicker,
          selectedEmoji,
        )}
      </div>
    </>
  );
};
