import SendMessage from "./send-message/SendMessage";
import JoinBroadcastChannel from "./JoinBroadcastChannel";
import JoinGroupChannel from "./JoinGroupChannel";
type JoinGroupChannelProp = {
  channelId: string;
  user: any;
  channelInfo: any;
  channelMemberInfo: any;
  isUserChannelMember: boolean;
};

export const ChannelActionBar = ({
  channelId,
  user,
  channelInfo,
  channelMemberInfo,
  isUserChannelMember,
}: JoinGroupChannelProp) => {
  if (!channelMemberInfo) return null;

  const isChannelOwner = channelInfo?.created_by === user?.id;
  const isChannelAdmin = channelMemberInfo.channel_member_role === "ADMIN";

  // For DIRECT, PRIVATE and default cases
  if (["DIRECT", "PRIVATE"].includes(channelInfo?.type) || !channelInfo?.type) {
    return <SendMessage channelId={channelId} user={user} />;
  }

  // Specific logic for BROADCAST
  if (channelInfo?.type === "BROADCAST") {
    if (isChannelOwner || isChannelAdmin) {
      return <SendMessage channelId={channelId} user={user} />;
    }
    return isUserChannelMember ? (
      <JoinBroadcastChannel
        channelId={channelId}
        user={user}
        isUserChannelMember={isUserChannelMember}
        channelMemberInfo={channelMemberInfo}
      />
    ) : (
      <JoinGroupChannel channelId={channelId} user={user} />
    );
  }

  // For GROUP and PUBLIC cases
  if (["GROUP", "PUBLIC"].includes(channelInfo?.type)) {
    return isUserChannelMember ? (
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
