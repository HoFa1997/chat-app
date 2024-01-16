import { useCallback } from "react";
import { useStore } from "@stores/index";
import { useAuthStore } from "@stores/index";
import { join2Channel } from "@/api";
import { useApi } from "@/shared/hooks/useApi";

export default function JoinGroupChannel() {
  const { channelId } = useStore((state: any) => state.workspaceSettings);
  const user = useAuthStore((state) => state.profile);
  const { loading, request: request2JoinChannel } = useApi(join2Channel, null, false);
  const setWorkspaceSetting = useStore((state: any) => state.setWorkspaceSetting);
  const setOrUpdateChannel = useStore((state) => state.setOrUpdateChannel);
  const channel = useStore((state) => state.channels.get(channelId));

  // TODO: move to api layer
  const joinToChannel = useCallback(async () => {
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

  if (!user || !channelId) return null;

  return (
    <div className="flex w-full flex-col items-center justify-center p-2">
      <button className="btn btn-block" onClick={joinToChannel}>
        Join Channel
        {loading && <span className="loading loading-spinner ml-auto"></span>}
      </button>
    </div>
  );
}
