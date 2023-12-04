import { Box, Chip } from "@mui/material";

export const ChatContainer = () => {
  return (
    <Box display="flex" alignItems="center" height="100vh" justifyContent="center" bgcolor="gray" flexGrow={1}>
      <Chip label="Select a chat to start messaging" />
    </Box>
  );
};
