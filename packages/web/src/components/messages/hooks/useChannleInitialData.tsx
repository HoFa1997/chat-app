import { useEffect, useState } from "react";
import { useStore, useAuthStore } from "@stores/index";
import { groupedMessages } from "@utils/index";
import { fetchChannelInitialData } from "@/api";
import { set } from "lodash";

interface UseChannelInitialData {
  initialMessagesLoading: boolean;
  msgLength: number;
}

export const useChannelInitialData = (setError: (error: any) => void): UseChannelInitialData => {
  const [initialMessagesLoading, setInitialMessagesLoading] = useState<boolean>(true);
  const [msgLength, setMsgLength] = useState<number>(0);
  const bulkSetChannelPinnedMessages = useStore((state: any) => state.bulkSetChannelPinnedMessages);
  const bulkSetMessages = useStore((state) => state.bulkSetMessages);
  const channelId = useStore((state) => state.workspaceSettings.channelId as string);
  const setWorkspaceSetting = useStore((state) => state.setWorkspaceSetting);
  const setLastMessage = useStore((state) => state.setLastMessage);
  const addChannelMember = useStore((state) => state.addChannelMember);

  const processChannelData = async (channelId: string) => {
    const { data: channelData, error: channelError } = await fetchChannelInitialData({
      input_channel_id: channelId,
      message_limit: 20,
    });

    console.log({
      channelData,
    });

    if (channelError) throw new Error(channelError.message);

    setWorkspaceSetting(
      "scrollPageOffset",
      channelData?.total_messages_since_last_read >= 20
        ? channelData?.total_messages_since_last_read
        : 20,
    );
    setWorkspaceSetting("unreadMessage", channelData?.unread_message);
    setWorkspaceSetting("lastReadMessageId", channelData?.last_read_message_id);
    setWorkspaceSetting("lastReadMessageTimestamp", channelData?.last_read_message_timestamp);
    setWorkspaceSetting("totalMsgSincLastRead", channelData?.total_messages_since_last_read);

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
    if (channelData.channel_member_info) {
      const userId = useAuthStore.getState().session.id;

      addChannelMember(channelId, {
        ...channelData.channel_member_info,
        id: userId,
      });
    }

    setWorkspaceSetting("isUserChannelMember", channelData?.is_user_channel_member || false);

    if (channelData.channel_info) {
      setWorkspaceSetting("channelInfo", channelData.channel_info);
    }

    if (channelData.pinned_messages) {
      bulkSetChannelPinnedMessages(channelId, channelData.pinned_messages);
    }

    if (channelData.last_messages) {
      const newMessages = groupedMessages(channelData.last_messages.reverse());
      const lastMessage = newMessages.at(-1);
      setLastMessage(channelId, lastMessage);
      bulkSetMessages(channelId, newMessages);
      setMsgLength(newMessages.length);
    } else {
      setMsgLength(0);
    }
  };

  return {
    initialMessagesLoading,
    msgLength,
  };
};
