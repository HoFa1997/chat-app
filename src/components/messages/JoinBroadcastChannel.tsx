"use client";
import { supabaseClient } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";

type JoinChannelProp = {
  channelId: string;
  user: User;
  userJoinedToChannle: boolean;
  channelMember: any;
};

export default function JoinBroadcastChannel({ channelId, user, userJoinedToChannle, channelMember }: JoinChannelProp) {
  const [mute, setMute] = useState(false);

  useEffect(() => {
    if (!channelMember) return;

    setMute(channelMember.mute_in_app_notifications);
  }, [channelMember]);

  const joinUserToChannel = useCallback(async () => {
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

  const muteHandler = useCallback(
    async (muteOrUnmute: boolean) => {
      if (!channelMember) return;

      setMute(muteOrUnmute);

      try {
        const { data, error } = await supabaseClient.from("channel_members").upsert({
          id: channelMember.id,
          channel_id: channelId,
          member_id: user.id,
          mute_in_app_notifications: muteOrUnmute,
        });

        if (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [user, channelId, channelMember],
  );

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
      {userJoinedToChannle ? (
        <Button variant="text" onClick={() => muteHandler(!mute)} style={{ padding: "16px 0" }} fullWidth>
          {mute ? "Unmute" : "Mute"}
        </Button>
      ) : (
        <Button variant="text" onClick={joinUserToChannel} style={{ padding: "16px 0" }} fullWidth>
          Join
        </Button>
      )}
    </Box>
  );
}
