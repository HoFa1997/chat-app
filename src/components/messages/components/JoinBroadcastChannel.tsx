import { supabaseClient } from "@/api/supabase";
import { useEffect, useState, useCallback } from "react";
import { useStore, useAuthStore } from "@stores/index";

type JoinChannelProp = {
  channelMemberInfo: any;
};

export default function JoinBroadcastChannel({ channelMemberInfo }: JoinChannelProp) {
  const [mute, setMute] = useState(false);
  const { channelId, isUserChannelMember } = useStore((state: any) => state.workspaceSettings);
  const user = useAuthStore.getState().profile;

  useEffect(() => {
    if (!channelMemberInfo) return;

    setMute(channelMemberInfo.mute_in_app_notifications);
  }, [channelMemberInfo]);

  const joinUserToChannel = useCallback(async () => {
    try {
      const { error } = await supabaseClient
        .from("channel_members")
        .upsert({ channel_id: channelId, member_id: user?.id });

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
          .eq("member_id", user?.id)
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

  if (!user || !channelId) return null;

  return (
    <div className="flex w-full flex-col items-center justify-center p-2">
      {isUserChannelMember ? (
        <button className="btn btn-block" onClick={() => muteHandler(!mute)}>
          {mute ? "Unmute" : "Mute"}
        </button>
      ) : (
        <button className="btn btn-block" onClick={joinUserToChannel}>
          Join
        </button>
      )}
    </div>
  );
}
