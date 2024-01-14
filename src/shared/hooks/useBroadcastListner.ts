import { useStore } from "@stores/index";
import { useEffect } from "react";

type TBroadcastPayload = {
  event: "pinnedMessage";
  type: "broadcast";
  payload: { actionType: "pin" | "unpin"; message: any };
};

export const useBroadcastListner = () => {
  const { workspaceBroadcaster } = useStore((state) => state.workspaceSettings);
  const addChannelPinnedMessage = useStore((state) => state.addChannelPinnedMessage);
  const removeChannelPinnedMessage = useStore((state) => state.removeChannelPinnedMessage);

  useEffect(() => {
    if (!workspaceBroadcaster) return;
    workspaceBroadcaster.on("broadcast", { event: "pinnedMessage" }, ({ payload }: TBroadcastPayload) => {
      const message = payload.message;
      if (payload.actionType === "pin") {
        addChannelPinnedMessage(message.channel_id, message);
      } else if (payload.actionType === "unpin") {
        removeChannelPinnedMessage(message.channel_id, message.id);
      }
    });
  }, [workspaceBroadcaster]);
};
