import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Chip, Typography } from "@mui/material";
import MessageCard from "./MessageCard";
import ScrollToBottomButton from "./ScrollToBottomButton"; // Import the new component
import { format, isSameDay, parseISO } from "date-fns"; // Make sure to install date-fns

export const MessagesDisplay = ({
  messages,
  messageContainerRef,
  messagesEndRef,
  userSession,
  lastMsgUserId,
  setLastMsgUserId,
  toggleEmojiPicker,
  selectedEmoji,
}: any) => {
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = messageContainerRef.current?.scrollTop || 0;
      // Set the state based on the scroll direction
      setIsScrollingUp(currentScrollTop < lastScrollTop.current);
      // Update the last scroll position
      lastScrollTop.current = currentScrollTop;
    };

    const currentRef = messageContainerRef.current;
    // Add the scroll event listener
    currentRef?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      // Clean up the event listener
      currentRef?.removeEventListener("scroll", handleScroll);
    };
  }, [messageContainerRef.current, messages]);

  if (messages.size === 0) {
    return (
      <Box display="flex" alignItems="center" height="100vh" justifyContent="center" flexGrow={1}>
        <Chip label={<Typography variant="body2">No messages yet!</Typography>} />
      </Box>
    );
  }

  // This function checks if two dates are different days.
  const isNewDay = (currentMessageDate, previousMessageDate) => {
    return !isSameDay(parseISO(currentMessageDate), parseISO(previousMessageDate));
  };

  const messageElements = Array.from(messages.values()).flatMap((message, index, array) => {
    const elements = [];

    // Check if the message is the start of a new day.
    if (index === 0 || isNewDay(message.created_at, array[index - 1].created_at)) {
      // Push a date chip into the elements array with sticky positioning.
      elements.push(
        <Box
          key={message.created_at}
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 2,
            pt: 2,
            width: "100%",
            position: isScrollingUp ? "sticky" : "relative", // Position sticky when scrolling up
            top: isScrollingUp ? 0 : undefined, // Stick to the top when scrolling up
            zIndex: 2, // Ensure the sticky element is above other elements
            backgroundColor: "inherit", // Use the appropriate color to match your design
          }}
        >
          <Chip label={format(parseISO(message.created_at), "MMMM do, yyyy")} />
        </Box>,
      );
    }

    // Push the message card into the elements array.
    elements.push(
      <MessageCard
        key={message.id}
        data={message}
        user={userSession}
        ref={index === array.length - 1 ? messagesEndRef : null}
        lastMsgUserId={lastMsgUserId}
        setLastMsgUserId={setLastMsgUserId}
        toggleEmojiPicker={toggleEmojiPicker}
        selectedEmoji={selectedEmoji}
      />,
    );

    return elements;
  });

  return (
    <>
      <Box
        className="message_list"
        sx={{
          pt: 1,
          px: 10,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          scrollbarWidth: "none",
          position: "relative",
        }}
        ref={messageContainerRef}
      >
        {messageElements}
      </Box>
      <ScrollToBottomButton messagesContainer={messageContainerRef} />
    </>
  );
};
