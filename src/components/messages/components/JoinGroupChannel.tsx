"use client";
import { supabaseClient } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { useCallback } from "react";
import { Box, Button } from "@mui/material";

type JoinGroupChannelProp = {
  channelId: string;
  user: User;
  channelMembers: any;
};

export default function JoinGroupChannel({ channelId, user }: JoinGroupChannelProp) {
  const joinToChannel = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient
        .from("channel_members")
        .upsert({ channel_id: channelId, member_id: user.id });

      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }, [user, channelId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#121212",
        borderTop: "2px solid #464646",
      }}
    >
      <Button variant="text" onClick={joinToChannel} style={{ padding: "16px 0" }} fullWidth>
        Join Channel
      </Button>
    </Box>
  );
}
