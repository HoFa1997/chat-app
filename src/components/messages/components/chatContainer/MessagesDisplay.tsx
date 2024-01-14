import React, { useState, useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import { format, isSameDay, parseISO } from "date-fns";
import { useStore } from "@stores/index";

interface MessagesDisplayProps {
  messageContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  toggleEmojiPicker: any;
  selectedEmoji: any; // Update the type based on your emoji implementation
  isLoadingMore: boolean;
}

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

const generateMessageElements = (
  messages: Map<string, any>,
  isScrollingUp: boolean,
  messagesEndRef: React.RefObject<HTMLDivElement>,
  toggleEmojiPicker: any,
  selectedEmoji: string,
) => {
  const messagesArray = Array.from(messages.values());
  return messagesArray.flatMap((message, index, array) => {
    const elements = [];
    if (index === 0 || isNewDay(message.created_at, array[index - 1]?.created_at)) {
      elements.push(<DateChip key={message.created_at} date={message.created_at} isScrollingUp={isScrollingUp} />);
    }
    elements.push(
      <MessageCard
        key={message.id}
        data={message}
        ref={index === array.length - 1 ? messagesEndRef : null}
        toggleEmojiPicker={toggleEmojiPicker}
        selectedEmoji={selectedEmoji}
      />,
    );
    return elements;
  });
};

const isNewDay = (currentMessageDate: string, previousMessageDate: string) => {
  return !isSameDay(parseISO(currentMessageDate), parseISO(previousMessageDate));
};

const DateChip: React.FC<{ date: string; isScrollingUp: boolean }> = ({ date, isScrollingUp }) => (
  <div
    className="date_chip z-10 relative my-2 flex w-full justify-center pt-2"
    style={{ position: isScrollingUp ? "sticky" : "relative", top: isScrollingUp ? 0 : undefined }}
  >
    <div className="badge relative z-10 bg-base-100">{format(parseISO(date), "MMMM do, yyyy")}</div>
  </div>
);

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
  const messagesByChannel = useStore((state: any) => state.messagesByChannel);
  const messages = messagesByChannel.get(channelId) as Map<string, any>;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = messageContainerRef.current?.scrollTop || 0;
      setIsScrollingUp(currentScrollTop < lastScrollTop.current);
      lastScrollTop.current = currentScrollTop;
    };

    const currentRef = messageContainerRef.current;
    currentRef?.addEventListener("scroll", handleScroll, { passive: true });

    return () => currentRef?.removeEventListener("scroll", handleScroll);
  }, [messageContainerRef]);

  if (!messages || messages.size === 0) {
    return <NoMessagesDisplay />;
  }

  return (
    <div className="relative flex w-full grow flex-col overflow-y-auto px-10 pt-1" ref={messageContainerRef}>
      {isLoadingMore && <LoadingSpinner />}
      {generateMessageElements(messages, isScrollingUp, messagesEndRef, toggleEmojiPicker, selectedEmoji)}
    </div>
  );
};
