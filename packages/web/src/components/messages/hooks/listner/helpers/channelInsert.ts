import { useStore } from "@stores/index";

export const channelInsert = (payload: any) => {
  const setOrUpdateChannel = useStore.getState().setOrUpdateChannel;
  setOrUpdateChannel(payload.new.id, payload.new);
};
