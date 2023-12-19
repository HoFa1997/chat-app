import { ChannelItem } from "./ChannelItem";
import NewChannelModal from "./NewChannelModal";
import { UserInfoCard } from "./UserInfoCard";
import { Box, List } from "@mui/material";

export default function ChannelList({ user, channels }) {
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
      <NewChannelModal />
      <List disablePadding sx={{ mt: 1 }}>
        {channels?.map((item) => <ChannelItem key={item.id} data={item} />)}
      </List>
    </Box>
  );
}
