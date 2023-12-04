import { getAllChannels, getAllMessages, getUser } from "@/api";
import MessageCard from "./MessageCard";
import { cookies } from "next/headers";
import SendMessage from "./send-message/SendMessage";
import { Box, CircularProgress, Chip, Typography } from "@mui/material";
import { MessageHeader } from "./MessageHeader";

export default async function MessageContainer({ channelId }: { channelId: string }) {
  const { data: messages } = await getAllMessages(channelId);
  const { data: channels } = await getAllChannels();
  const cookieStore = cookies();

  const {
    data: { user },
    error,
  } = await getUser(cookieStore);

  if (!user || !channels) {
    return <CircularProgress />;
  }

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
      }}
    >
      <MessageHeader channelId={channelId} />
      {messages?.length === 0 && (
        <Box display="flex" alignItems="center" height="100vh" justifyContent="center" flexGrow={1}>
          <Chip label={<Typography variant="body2">No messages yet!</Typography>} />
        </Box>
      )}
      <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", overflowY: "auto", px: 10 }}>
        {messages?.map((item) => <MessageCard key={item.id} data={item} user={user} />)}
      </Box>
      <SendMessage channelId={channelId} user={user} channels={channels} />
    </Box>
  );
}
