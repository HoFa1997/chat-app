import { getAllChannels, getAllMessages, getUser } from "@/api";
import MessageCard from "./MessageCard";
import { cookies } from "next/headers";
import SendMessage from "./send-message/SendMessage";
import { Box, CircularProgress } from "@mui/material";

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
      sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", overflowY: "auto", scrollbarWidth: "none" }}>
        {messages?.map((item) => <MessageCard key={item.id} data={item} user={user} />)}
      </Box>
      <SendMessage channelId={channelId} user={user} channels={channels} />
    </Box>
  );
}
