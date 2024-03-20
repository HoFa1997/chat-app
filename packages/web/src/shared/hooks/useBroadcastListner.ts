import { useStore } from "@stores/index";
import { useEffect } from "react";

type TBroadcastPayload = {
  event: "pinnedMessage";
  type: "broadcast";
  payload: { actionType: "pin" | "unpin"; message: any };
};

type TTypeIndicator = {
  event: "pinnedMessage";
  type: "typingIndicator";
  payload: {
    channelId: string;
    user: any;
    type: "startTyping" | "stopTyping";
  };
};

export const useBroadcastListner = () => {
  const { workspaceBroadcaster: broadcaster } = useStore((state) =>
    state.workspaceSettings
  );
  const addChannelPinnedMessage = useStore((state) =>
    state.addChannelPinnedMessage
  );
  const removeChannelPinnedMessage = useStore((state) =>
    state.removeChannelPinnedMessage
  );

  const setTypingIndicator = useStore((state) => state.setTypingIndicator);
  const removeTypingIndicator = useStore((state) =>
    state.removeTypingIndicator
  );

  useEffect(() => {
    if (!broadcaster) return;
    broadcaster.on(
      "broadcast",
      { event: "pinnedMessage" },
      ({ payload }: TBroadcastPayload) => {
        const message = payload.message;
        const type = payload.actionType;

        if (type === "pin") {
          addChannelPinnedMessage(message.channel_id, message);
        } else if (type === "unpin") {
          removeChannelPinnedMessage(message.channel_id, message.id);
        }
      },
    ).on("broadcast", { event: "typingIndicator" }, (data: TTypeIndicator) => {
      const payload = data.payload;
      if (payload.type === "startTyping") {
        setTypingIndicator(payload.channelId, payload.user);
      } else if (payload.type === "stopTyping") {
        removeTypingIndicator(payload.channelId, payload.user);
      }
    });
  }, [broadcaster]);
};
