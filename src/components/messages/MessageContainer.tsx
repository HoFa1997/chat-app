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
  useScrollAndLoad,
  useEmojiBoxHandler,
} from "./hooks";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function MessageContainer({ channelId }: any) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState(new Map());
  const [error, setError] = useState(null);
  const [channelMembers, setChannelMembers] = useState(new Map());
  const [lastMsgUserId, setLastMsgUserId] = useState(null);
  const emojiPikerRef = useRef<HTMLDivElement | null>(null);

  const { loading, messageContainerRef, messagesEndRef } = useScrollAndLoad(messages);
  const { channelInfo } = useChannelData(channelId, user, setError);
  useUserData(setUser, setError);
  useMessagesData(channelId, setMessages, setError);
  useMessageSubscription(channelId, setMessages, messages, channelMembers);
  const { isChannelMember, setIsChannelMember } = useChannelMemmberData(channelId, user, setError, setChannelMembers);
  useChannelMemberSubscription(channelId, channelMembers, setChannelMembers, user, setIsChannelMember);

  const { isEmojiBoxOpen, closeEmojiPicker, emojiPickerPosition, selectedEmoji, handleEmojiSelect, toggleEmojiPicker } =
    useEmojiBoxHandler(emojiPikerRef);

  useEffect(() => {
    // Only attach listeners if the emoji box is open and the container exists
    if (!isEmojiBoxOpen || !messageContainerRef.current) {
      return;
    }

    const handleEvent = () => {
      closeEmojiPicker();
    };

    // Attach event listeners
    const msgContainer = messageContainerRef.current;
    msgContainer.addEventListener("scroll", handleEvent);
    window.addEventListener("resize", handleEvent);

    // Clean up event listeners
    return () => {
      msgContainer.removeEventListener("scroll", handleEvent);
      window.removeEventListener("resize", handleEvent);
    };
  }, [isEmojiBoxOpen]); // Depend only on isEmojiBoxOpen

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
      className="message_list"
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
      <Box
        display={loading ? "block" : "none"}
        style={{
          backgroundImage: "url(/bg-chat.webp)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        position="absolute"
        width="100%"
        height="100%"
        top="0"
        left="0"
        zIndex="9"
      >
        <Box sx={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      </Box>

      {messages.size === 0 ? (
        <Box display="flex" alignItems="center" height="100vh" justifyContent="center" flexGrow={1}>
          <Chip label={<Typography variant="body2">No messages yet!</Typography>} />
        </Box>
      ) : (
        <Box
          className="message_list"
          sx={{
            px: 10,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
          ref={messageContainerRef}
        >
          {Array.from(messages.values()).map((item, index, array) => (
            <MessageCard
              key={item.id}
              data={item}
              user={user}
              ref={index === array.length - 1 ? messagesEndRef : null}
              lastMsgUserId={lastMsgUserId}
              setLastMsgUserId={setLastMsgUserId}
              toggleEmojiPicker={toggleEmojiPicker}
              selectedEmoji={selectedEmoji}
            />
          ))}
        </Box>
      )}

      <Box
        id="emoji_picker"
        sx={{
          position: "fixed",
          top: `${emojiPickerPosition.top}px`,
          left: `${emojiPickerPosition.left}px`,
          visibility: isEmojiBoxOpen ? "visible" : "hidden",
          zIndex: 999,
        }}
        ref={emojiPikerRef}
      >
        <Picker data={data} onClickOutside={closeEmojiPicker} onEmojiSelect={handleEmojiSelect} />
      </Box>

      <div style={{ marginTop: "auto" }}>
        <ChannelActionBar channelId={channelId} user={user} channelInfo={channelInfo} channelMembers={channelMembers} />
      </div>
    </Box>
  );
}
