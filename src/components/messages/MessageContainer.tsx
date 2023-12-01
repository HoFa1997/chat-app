import { getAllMessages, getUser } from "@/api";
import MessageCard from "./MessageCard";
import { cookies } from "next/headers";
import SendMessage from "./send-message/SendMessage";
import { Box, CircularProgress } from "@mui/material";

export default async function MessageContainer({ channelId }: { channelId: string }) {
  const { data: messages } = await getAllMessages(channelId);
  const cookieStore = cookies();

  const {
    data: { user },
    error,
  } = await getUser(cookieStore);

  if (!user) {
    return <CircularProgress />;
  }

  if (error) {
    return <Box>Error loading messages...</Box>;
  }
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", pt: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {messages?.map((item) => <MessageCard key={item.id} data={item} user={user} />)}
      </Box>
      <SendMessage channelId={channelId} user={user} />
    </Box>
  );
}
