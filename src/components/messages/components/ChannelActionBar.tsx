import SendMessage from "./send-message/SendMessage";
import JoinBroadcastChannel from "./JoinBroadcastChannel";
import JoinGroupChannel from "./JoinGroupChannel";
type JoinGroupChannelProp = {
  channelId: string;
  user: any;
  channelInfo: any;
  channelMembers: any;
};

export const ChannelActionBar = ({ channelId, user, channelInfo, channelMembers }: JoinGroupChannelProp) => {
  const isChannelOwner = channelInfo?.created_by === user?.id;
  const isChannelAdmin = channelMembers.get(user?.id)?.channel_member_role === "ADMIN";
  const isChannelMember = channelMembers.has(user?.id);

  // For DIRECT, PRIVATE and default cases
  if (["DIRECT", "PRIVATE"].includes(channelInfo?.type) || !channelInfo?.type) {
    return <SendMessage channelId={channelId} user={user} />;
  }

  // Specific logic for BROADCAST
  if (channelInfo?.type === "BROADCAST") {
    if (isChannelOwner || isChannelAdmin) {
      return <SendMessage channelId={channelId} user={user} />;
    }
    return isChannelMember ? (
      <JoinBroadcastChannel
        channelId={channelId}
        user={user}
        isChannelMember={isChannelMember}
        channelMembers={channelMembers}
      />
    ) : (
      <JoinGroupChannel channelId={channelId} user={user} />
    );
  }

  // For GROUP and PUBLIC cases
  if (["GROUP", "PUBLIC"].includes(channelInfo?.type)) {
    return isChannelMember ? (
      <SendMessage channelId={channelId} user={user} />
    ) : (
      <JoinGroupChannel channelId={channelId} user={user} />
    );
  }

  // For ARCHIVE
  if (channelInfo?.type === "ARCHIVE") {
    return "";
  }
};
