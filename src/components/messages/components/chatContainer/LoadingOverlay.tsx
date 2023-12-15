import { Box, CircularProgress } from "@mui/material";

export const LoadingOverlay = ({ loading }: any) => {
  if (!loading) return null;
  return (
    <Box
      display={loading ? "block" : "none"}
      style={{
        backgroundImage: "url(/bg-chat.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      position="absolute"
      width="100%"
      height="100%"
      top="0"
      left="0"
      zIndex="9"
    >
      <Box sx={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    </Box>
  );
};
