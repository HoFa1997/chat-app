import { ChannelActionBar } from "../ChannelActionBar";

export const ActionBar = ({ channelMemberInfo }: any) => {
  return (
    <div className="mt-auto w-full">
      <ChannelActionBar channelMemberInfo={channelMemberInfo} />
    </div>
  );
};
