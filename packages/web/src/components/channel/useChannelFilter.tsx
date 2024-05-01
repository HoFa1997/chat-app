import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore, useAuthStore } from "@stores/index";
import { TChannel } from "@stores/index";
import { getChannels } from "@/api";

const sortChannelsByLastActivity = (channels: TChannel[]) => {
  return channels.sort((a, b) => {
    const dateA = new Date(a.last_activity_at);
    const dateB = new Date(b.last_activity_at);
    return dateB.getTime() - dateA.getTime(); // Descending order
  });
};

export const useChannelFilter = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.profile);
  const setWorkspaceChannelSetting = useStore((state) => state.setWorkspaceChannelSetting);
  const [filteredChannels, setFilteredChannels] = useState<any>([]);
  const channels = useStore((state) => state.channels);
  const channelId = router.query.channelId as string;
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    if (!user || !channels) return;
    if (channels.size === 0) return;
    const selectedChannel = channels.get(channelId);
    if (!selectedChannel) return;
    const isUserChannelOwner = selectedChannel.created_by === user.id;

    setWorkspaceChannelSetting(channelId, "isUserChannelOwner", isUserChannelOwner);
    setWorkspaceChannelSetting(channelId, "channelInfo", selectedChannel);
  }, [user, channels, channelId]);

  // set and sort channels
  useEffect(() => {
    if (activeType === "global") return;
    if (channels && channels.size > 0) {
      const sortedChannels = sortChannelsByLastActivity(
        Array.from(channels.values()).filter((x) => x.type && x.type !== "THREAD"),
      );

      setFilteredChannels(sortedChannels);
    } else {
      setFilteredChannels([]);
    }
  }, [channels]);

  const handleFilterChange = async (filterType: string) => {
    setActiveType(filterType);
    if (filterType === "global") {
      // Fetch all channels that the current user is not a member of,
      // including the private ones, for demonstration purposes.
      const workspaceId = useStore.getState().workspaceSettings.workspaceId as string;
      const { data } = await getChannels(workspaceId);

      setFilteredChannels(data);
    } else if (filterType === "all") {
      setFilteredChannels(Array.from(channels.values())); // Show all channels
    } else {
      setFilteredChannels(
        [...channels.values()].filter((channel: any) => channel.type === filterType),
      );
    }
  };

  return { filteredChannels, handleFilterChange, channels, activeType };
};
