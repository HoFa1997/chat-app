import PinnedMessagesSlider from "../PinnedMessagesSlider";
import { useStore } from "@stores/index";
import { useChannel } from "@/shared/context/ChannelProvider";

export const PinnedMessagesDisplay = ({ loading }: any) => {
  const { channelId } = useChannel();

  const channelPinnedMessages = useStore((state: any) => state.pinnedMessages);
  const pinnedMessages = channelPinnedMessages.get(channelId);

  if (!pinnedMessages || pinnedMessages?.size === 0) return null;

  return (
    <div
      className="relative z-10 w-full   bg-base-100 "
      style={{ display: loading ? "none" : "block" }}
    >
      <PinnedMessagesSlider pinnedMessagesMap={pinnedMessages} />
    </div>
  );
};
