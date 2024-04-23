import React, { useState, useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import { format, isSameDay, parseISO } from "date-fns";
import { useStore } from "@stores/index";
import { useCheckReadMessage } from "../../hooks";

interface MessagesDisplayProps {
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

const NoMessagesDisplay = () => (
  <div className="flex h-dvh items-center justify-center">
    <div className="badge badge-neutral">No messages yet!</div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center pt-2">
    <span className="loading loading-spinner text-primary"></span>
  </div>
);

const SystemNotifyChip = ({ message }: any) => {
  const cardRef = useRef(null);

  useEffect(() => {
    console.log(message);
    // we need for check message readed or not
    // Attach the message.id to the cardRef directly
    if (cardRef.current) {
      cardRef.current.msgId = message.id;
      cardRef.current.readedAt = message.readed_at;
      cardRef.current.createdAt = message.created_at;
    }
  }, [message]);

  return (
    <div className="chat msg_card my-4 flex justify-center pb-1" ref={cardRef}>
      <div className="badge badge-secondary">{message.content}</div>
    </div>
  );
};

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
      elements.push(<SystemNotifyChip key={message.id} message={message} />);
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

export const MessagesDisplay: React.FC<MessagesDisplayProps> = ({
  messageContainerRef,
  messagesEndRef,
  toggleEmojiPicker,
  selectedEmoji,
  isLoadingMore,
}) => {
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollTop = useRef(0);
  const { channelId } = useStore((state: any) => state.workspaceSettings);
  const messages = useStore((state: any) => state.messagesByChannel.get(channelId));

  // mark as read message
  useCheckReadMessage({ messageContainerRef, channelId, messages });

  if (!messages || messages.size === 0) {
    return <NoMessagesDisplay />;
  }

  return (
    <>
      <div
        className="relative msg_wrapper flex w-full grow flex-col overflow-y-auto px-10 pt-1"
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
