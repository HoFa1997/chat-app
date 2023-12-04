import { getAllChannels, getUser } from "@/api";
import { ChannelItem } from "./ChannelItem";
import NewChannelModal from "./NewChannelModal";
import { cookies } from "next/headers";
import { UserInfoCard } from "./UserInfoCard";
import { Box, List } from "@mui/material";

export default async function ChannelList() {
  const cookieStore = cookies();
  const {
    data: { user },
  } = await getUser(cookieStore);

  const { data: channels } = await getAllChannels();

  if (!user) return null;

  return (
    <Box
      px={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "30%",
        overflow: "auto",
      }}
    >
      <UserInfoCard userData={user} />
      <NewChannelModal userData={user} />
      <List disablePadding sx={{ mt: 1 }}>
        {channels?.map((item) => <ChannelItem key={item.id} data={item} />)}
      </List>
    </Box>
  );
}
