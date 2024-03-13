import { immer } from "zustand/middleware/immer";

type WorkspaceSettings = {
  workspaceId?: string | null | undefined;
  channelId?: string | null | undefined;
  channelInfo?: any;
  isUserChannelMember?: boolean;
  isUserChannelOwner?: boolean;
  isUserChannelAdmin?: boolean;
  workspaceBroadcaster?: any;
  userPickingEmoji?: boolean;
  replayMessageMemory?: any;
  editeMessageMemory?: any;
  forwardMessageMemory?: any;
};

export interface IWorkspaceSettingsStore {
  workspaceSettings: WorkspaceSettings;
  setWorkspaceSetting: (key: string, value: any) => void;
  setWorkspaceSettings: (settings: WorkspaceSettings) => void;
  setReplayMessageMemory: (message: any) => void;
  setEditeMessageMemory: (message: any) => void;
  setForwardMessageMemory: (message: any) => void;
}

const useWorkspaceSettingsStore = immer<IWorkspaceSettingsStore>((set) => ({
  workspaceSettings: {
    workspaceId: null,
    channelId: null,
    channelInfo: {},
    isUserChannelMember: false,
    isUserChannelOwner: false,
    isUserChannelAdmin: false,
    userPickingEmoji: false,
    replayMessageMemory: null,
    editeMessageMemory: null,
    forwardMessageMemory: null,
  },

  // Update a single setting
  setWorkspaceSetting: (key, value) => {
    return set((state) => ({
      workspaceSettings: { ...state.workspaceSettings, [key]: value },
    }));
  },

  // Update multiple settings at once
  setWorkspaceSettings: (settings) => {
    return set((state) => ({
      workspaceSettings: { ...state.workspaceSettings, ...settings },
    }));
  },

  // Set the replay message memory
  setReplayMessageMemory: (message) => {
    return set((state) => ({
      workspaceSettings: { ...state.workspaceSettings, replayMessageMemory: message },
    }));
  },

  // Set the edit message memory
  setEditeMessageMemory: (message) => {
    return set((state) => ({
      workspaceSettings: { ...state.workspaceSettings, editeMessageMemory: message },
    }));
  },

  // Set the forward message memory
  setForwardMessageMemory: (message) => {
    return set((state) => ({
      workspaceSettings: { ...state.workspaceSettings, forwardMessageMemory: message },
    }));
  },
}));

export default useWorkspaceSettingsStore;
