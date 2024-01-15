import PinnedMessagesSlider from "../PinnedMessagesSlider";
import { useStore } from "@stores/index";

export const PinnedMessagesDisplay = ({ loading }: any) => {
  const channelId = useStore((state: any) => state.workspaceSettings.channelId);
  const channelPinnedMessages = useStore((state: any) => state.pinnedMessages);
  const pinnedMessages = channelPinnedMessages.get(channelId);

  if (!pinnedMessages || pinnedMessages?.size === 0) return null;

  return (
    <div className="relative z-10 w-full   bg-base-100 " style={{ display: loading ? "none" : "block" }}>
      <PinnedMessagesSlider pinnedMessagesMap={pinnedMessages} />
    </div>
  );
};
