import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore, useAuthStore } from "@stores/index";
import { TChannel } from "@stores/index";

const sortChannelsByLastActivity = (channels: TChannel[]) => {
  return channels.sort((a, b) => {
    const dateA = new Date(a.last_activity_at);
    const dateB = new Date(b.last_activity_at);
    return dateB.getTime() - dateA.getTime(); // Descending order
  });
};

export const useChannelFilter = () => {
  const user = useAuthStore((state) => state.profile);
  const setWorkspaceSettings = useStore((state) => state.setWorkspaceSettings);
  const router = useRouter();
  const [filteredChannels, setFilteredChannels] = useState<any>();
  const channels = useStore((state) => state.channels);

  useEffect(() => {
    if (!user || !channels) return;
    if (channels.size === 0) return;

    const channelId = router.query.channelId as string;
    const selectedChannel = channels.get(channelId);
    if (!selectedChannel) return;
    const isUserChannelOwner = selectedChannel.created_by === user.id;
    setWorkspaceSettings({
      channelId: channelId,
      isUserChannelOwner,
      channelInfo: selectedChannel,
    });
  }, [router.query, user, channels]);

  // set and sort channels
  useEffect(() => {
    if (channels && channels.size > 0) {
      const sortedChannels = sortChannelsByLastActivity(Array.from(channels.values()));
      setFilteredChannels(sortedChannels);
    }
  }, [channels]);

  const handleFilterChange = (filterType: string) => {
    if (filterType === "all") {
      setFilteredChannels(channels); // Show all channels
    } else {
      setFilteredChannels([...channels.values()].filter((channel: any) => channel.type === filterType));
    }
  };

  return { filteredChannels, handleFilterChange, channels };
};
