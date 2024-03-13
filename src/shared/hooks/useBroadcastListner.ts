import { useStore } from "@stores/index";
import { useEffect } from "react";

type TBroadcastPayload = {
  event: "pinnedMessage";
  type: "broadcast";
  payload: { actionType: "pin" | "unpin"; message: any };
};

export const useBroadcastListner = () => {
  const { workspaceBroadcaster: broadcaster } = useStore((state) => state.workspaceSettings);
  const addChannelPinnedMessage = useStore((state) => state.addChannelPinnedMessage);
  const removeChannelPinnedMessage = useStore((state) => state.removeChannelPinnedMessage);

  useEffect(() => {
    if (!broadcaster) return;
    broadcaster.on("broadcast", { event: "pinnedMessage" }, ({ payload }: TBroadcastPayload) => {
      const message = payload.message;
      const type = payload.actionType;

      if (type === "pin") {
        addChannelPinnedMessage(message.channel_id, message);
      } else if (type === "unpin") {
        removeChannelPinnedMessage(message.channel_id, message.id);
      }
    });
  }, [broadcaster]);
};
