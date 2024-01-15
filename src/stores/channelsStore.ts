import { immer } from "zustand/middleware/immer";
import { Database } from "@/types/supabase";

export type TChannel = Database["public"]["Tables"]["channels"]["Row"];

export interface IChannelStore {
  channels: Map<string, TChannel>;
  bulkSetChannels: (channels: TChannel[]) => void;
  clearAndInitialChannels: (channels: TChannel[]) => void;
  setOrUpdateChannel: (channelId: string, channelData: TChannel) => void;
  removeChannel: (channelId: string) => void;
  clearChannels: () => void;
}

const channelsStore = immer<IChannelStore>((set) => ({
  channels: new Map(),

  bulkSetChannels: (channels) => {
    set((state) => {
      channels.forEach((channel) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.channels.set(channel.id, channel);
      });
    });
  },

  setOrUpdateChannel: (channelId, channelData) => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.channels.set(channelId, channelData);
    });
  },

  removeChannel: (channelId) => {
    set((state) => {
      state.channels.delete(channelId);
    });
  },

  clearChannels: () => {
    set((state) => {
      state.channels.clear();
    });
  },

  clearAndInitialChannels: (channels) => {
    set((state) => {
      state.channels = new Map();
      channels.forEach((channel) => {
        state.channels.set(channel.id, channel);
      });
    });
  },
}));

export default channelsStore;