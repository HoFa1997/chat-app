import SendMessage from "./send-message/SendMessage";
import JoinBroadcastChannel from "./JoinBroadcastChannel";
import JoinGroupChannel from "./JoinGroupChannel";
import JoinPrivateChannel from "./JoinDirectChannel";
import JoinDirectChannel from "./JoinPrivateChannel";
import { useStore } from "@stores/index";
import { useChannel } from "@/shared/context/ChannelProvider";

export const ChannelActionBar = () => {
  const { channelId } = useChannel();

  const channelSettings = useStore((state: any) => state.workspaceSettings.channels.get(channelId));
  const { isUserChannelMember, isUserChannelOwner, isUserChannelAdmin, channelInfo } =
    channelSettings || {};

  const channels = useStore((state: any) => state.channels);

  if ((channels.has(channelId) && channels.get(channelId).type === "THREAD") || !channelInfo) {
    return <SendMessage />;
  }

  // For DIRECT, PRIVATE and default cases
  if (["DIRECT", "PRIVATE"].includes(channelInfo?.type) || !channelInfo?.type) {
    if (isUserChannelMember) {
      return <SendMessage />;
    } else if (channelInfo?.type === "PRIVATE") {
      return <JoinPrivateChannel />;
    } else {
      return <JoinDirectChannel />;
    }
  }

  // Specific logic for BROADCAST
  if (channelInfo?.type === "BROADCAST") {
    if (isUserChannelOwner || isUserChannelAdmin) {
      return <SendMessage />;
    }
    return isUserChannelMember ? <JoinBroadcastChannel /> : <JoinGroupChannel />;
  }

  // For GROUP and PUBLIC cases
  if (["GROUP", "PUBLIC"].includes(channelInfo?.type)) {
    return isUserChannelMember ? <SendMessage /> : <JoinGroupChannel />;
  }

  // For ARCHIVE
  if (channelInfo?.type === "ARCHIVE") {
    return "";
  }
};
