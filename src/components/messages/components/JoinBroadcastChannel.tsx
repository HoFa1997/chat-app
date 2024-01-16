import { supabaseClient } from "@/api/supabase";
import { useEffect, useState, useCallback } from "react";
import { useStore, useAuthStore } from "@stores/index";
import { join2Channel } from "@/api";
import { useApi } from "@/shared/hooks/useApi";

export default function JoinBroadcastChannel() {
  const [mute, setMute] = useState(false);
  const { channelId, isUserChannelMember } = useStore((state: any) => state.workspaceSettings);
  const user = useAuthStore((state) => state.profile);
  const { loading, request: request2JoinChannel } = useApi(join2Channel, null, false);

  const channelMemberInfo = useStore((state) => state.channelMembers.get(channelId));
  const setWorkspaceSetting = useStore((state: any) => state.setWorkspaceSetting);
  const setOrUpdateChannel = useStore((state) => state.setOrUpdateChannel);
  const channel = useStore((state) => state.channels.get(channelId));

  useEffect(() => {
    if (!channelMemberInfo || !user) return;
    const currentChannelMember = channelMemberInfo.get(user.id);
    setMute(currentChannelMember?.mute_in_app_notifications);
  }, [channelMemberInfo, user]);

  const joinUserToChannel = useCallback(async () => {
    if (!channel) return;
    try {
      const { error, data } = await request2JoinChannel({ channel_id: channelId, member_id: user?.id });
      if (error) console.error(error);
      setWorkspaceSetting("isUserChannelMember", true);
      setOrUpdateChannel(channelId, { ...channel, member_count: (channel?.member_count ?? 0) + 1 });
    } catch (error) {
      console.error(error);
    }
  }, [user, channelId, channel]);

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
          {loading && <span className="loading loading-spinner ml-auto"></span>}
        </button>
      )}
    </div>
  );
}
