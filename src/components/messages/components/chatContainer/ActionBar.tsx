import { Box } from "@mui/material";
import { ChannelActionBar } from "../ChannelActionBar";

export const ActionBar = ({ channelId, userSession, channelInfo, channelMemberInfo, isUserChannelMember }) => {
  return (
    <Box sx={{ marginTop: "auto" }}>
      <ChannelActionBar
        channelId={channelId}
        user={userSession}
        channelInfo={channelInfo}
        channelMemberInfo={channelMemberInfo}
        isUserChannelMember={isUserChannelMember}
      />
    </Box>
  );
};
