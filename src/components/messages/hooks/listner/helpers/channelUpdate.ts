import { useStore } from "@stores/index";

export const channelUpdate = (payload: any) => {
  const setOrUpdateChannel = useStore.getState().setOrUpdateChannel;

  setOrUpdateChannel(payload.new.id, payload.new);
};
