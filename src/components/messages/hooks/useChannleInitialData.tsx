import { useEffect, useState } from "react";
import { useStore } from "@stores/index";
import { groupedMessages } from "@utils/index";
import { fetchChannelInitialData } from "@/api";

interface UseChannelInitialData {
  initialMessagesLoading: boolean;
  channelMemberInfo?: any; // Replace with the correct type
  msgLength: number;
}

export const useChannelInitialData = (setError: (error: any) => void): UseChannelInitialData => {
  const [channelMemberInfo, setChannelMemberInfo] = useState<any>();
  const [initialMessagesLoading, setInitialMessagesLoading] = useState<boolean>(true);
  const [msgLength, setMsgLength] = useState<number>(0);

  const bulkSetChannelPinnedMessages = useStore((state: any) => state.bulkSetChannelPinnedMessages);
  const bulkSetMessages = useStore((state: any) => state.bulkSetMessages);
  const { channelId } = useStore((state: any) => state.workspaceSettings);
  const setWorkspaceSetting = useStore((state: any) => state.setWorkspaceSetting);
  const setOrUpdateChannel = useStore((state: any) => state.setOrUpdateChannel);
  const currentChannel = useStore((state: any) => state.channels.get(channelId));

  const processChannelData = async (channelId: string) => {
    const { data: channelData, error: channelError } = await fetchChannelInitialData({
      input_channel_id: channelId,
      message_limit: 20,
    });

    if (channelError) throw new Error(channelError.message);

    updateChannelState(channelData);
  };

  useEffect(() => {
    if (!channelId) return;

    async function fetchInitialData() {
      setInitialMessagesLoading(true);
      try {
        await processChannelData(channelId);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setInitialMessagesLoading(false);
      }
    }

    fetchInitialData();
  }, [channelId]);

  const updateChannelState = (channelData: any) => {
    if (channelData.member_count) {
      setOrUpdateChannel(channelId, { ...currentChannel, member_count: channelData.member_count });
    }

    setChannelMemberInfo(channelData.channel_member_info || undefined);

    if (channelData.is_user_channel_member) {
      setWorkspaceSetting("isUserChannelMember", channelData.is_user_channel_member);
    }

    if (channelData.channel_info) {
      setWorkspaceSetting("channelInfo", channelData.channel_info);
    }

    if (channelData.pinned_messages) {
      bulkSetChannelPinnedMessages(channelId, channelData.pinned_messages);
    }

    if (channelData.last_messages) {
      const newMessages = groupedMessages(channelData.last_messages.reverse());
      bulkSetMessages(channelId, newMessages);
      setMsgLength(newMessages.length);
    } else {
      setMsgLength(0);
    }
  };

  return {
    initialMessagesLoading,
    channelMemberInfo,
    msgLength,
  };
};
