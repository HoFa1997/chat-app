"use client";

import { ChatContainer } from "@/components/chat";
import { Box } from "@mui/material";
import { useMemo, useEffect } from "react";

export default function ChatPage() {
  return (
    <Box bgcolor={"red"} display={"flex"} width={"100%"}>
      <ChatContainer />
    </Box>
  );
}
