"use client";
import { supabaseClient } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";

type JoinChannelProp = {
  channelId: string;
  user: User;
  isUserChannelMember: boolean;
  channelMemberInfo: any;
};

export default function JoinBroadcastChannel({
  channelId,
  user,
  isUserChannelMember,
  channelMemberInfo,
}: JoinChannelProp) {
  const [mute, setMute] = useState(false);

  useEffect(() => {
    if (!channelMemberInfo) return;

    setMute(channelMemberInfo.mute_in_app_notifications);
  }, [channelMemberInfo]);

  const joinUserToChannel = useCallback(async () => {
    try {
      const { error } = await supabaseClient
        .from("channel_members")
        .upsert({ channel_id: channelId, member_id: user.id });

      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }, [user, channelId]);

  // we do not need to reload the page, the mute/unmute notification will be handled from the server
  const muteHandler = useCallback(
    async (muteOrUnmute: boolean) => {
      setMute(muteOrUnmute);

      try {
        const { error } = await supabaseClient
          .from("channel_members")
          .update({
            mute_in_app_notifications: muteOrUnmute,
          })
          .eq("channel_id", channelId)
          .eq("member_id", user.id)
          .select();

        if (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [user, channelId],
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
      {isUserChannelMember ? (
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
