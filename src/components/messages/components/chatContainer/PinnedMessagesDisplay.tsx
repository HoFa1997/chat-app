import { Box } from "@mui/material";
import PinnedMessagesSlider from "../PinnedMessagesSlider";

export const PinnedMessagesDisplay = ({ pinnedMessages, loading }: any) => {
  if (pinnedMessages.size === 0) return null;
  return (
    <Box
      display={!loading ? "block" : "none"}
      sx={{
        width: "100%",
        bgcolor: "#464646",
        borderBottom: "2px solid #fff",
        zIndex: 999,
        position: "relative",
      }}
    >
      <PinnedMessagesSlider pinnedMessagesMap={pinnedMessages} />
    </Box>
  );
};
