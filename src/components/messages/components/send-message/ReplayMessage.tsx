import { setReplayMessage, useReplayMessageInfo } from "@/shared/hooks";
import CloseIcon from "@mui/icons-material/CloseRounded";
import ReplayIcon from "@mui/icons-material/ReplyRounded";
import { Box, IconButton, Typography } from "@mui/material";

export const ReplayMessage = () => {
  const replayedMessage = useReplayMessageInfo();

  const handleCloseReplayMessage = () => {
    setReplayMessage(null);
  };

  if (!replayedMessage) return null;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        py: 2,
      }}
    >
      <ReplayIcon sx={{ height: 24, width: 24, color: "white" }} />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexGrow: 1,
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "start",
          pl: 3,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "white" }}>
          Reply to {replayedMessage?.user_id.username}
        </Typography>
        <Typography variant="h6" sx={{ color: "white" }}>
          {replayedMessage?.content}
        </Typography>
      </Box>
      <IconButton onClick={handleCloseReplayMessage}>
        <CloseIcon sx={{ height: 24, width: 24, borderRadius: "50%", backgroundColor: "white", color: "black" }} />
      </IconButton>
    </Box>
  );
};
