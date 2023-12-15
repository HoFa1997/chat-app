import { Box, Chip, Typography } from "@mui/material";
import MessageCard from "./MessageCard";

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
  if (messages.size === 0) {
    return (
      <Box display="flex" alignItems="center" height="100vh" justifyContent="center" flexGrow={1}>
        <Chip label={<Typography variant="body2">No messages yet!</Typography>} />
      </Box>
    );
  }

  return (
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
      {Array.from(messages.values()).map((item: any, index: any, array: any) => (
        <MessageCard
          key={item.id}
          data={item}
          user={userSession}
          ref={index === array.length - 1 ? messagesEndRef : null}
          lastMsgUserId={lastMsgUserId}
          setLastMsgUserId={setLastMsgUserId}
          toggleEmojiPicker={toggleEmojiPicker}
          selectedEmoji={selectedEmoji}
        />
      ))}
    </Box>
  );
};
