// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { create } from "zustand";
import { enableMapSet } from "immer";

import pinnedMessagesStore from "./channelPinnedMessagesStore";
import channelsStore from "./channelsStore";
import channelMessagesStore from "./channelMessagesStore";
import usersPresence from "./usersPresence";
import workspaceSettingsStore from "./workspaceSettingsStore";
import workspacesStore from "./workspacesStore";
import ChannelMembersStore from "./channelMembersStore";
import threadStore from "./threadStore";

enableMapSet();

// Define a comprehensive state type that includes all parts of your store
interface CombinedState
  extends
    ReturnType<typeof pinnedMessagesStore>,
    ReturnType<typeof workspacesStore>,
    ReturnType<typeof channelsStore>,
    ReturnType<typeof channelMessagesStore>,
    ReturnType<typeof usersPresence>,
    ReturnType<typeof ChannelMembersStore>,
    ReturnType<typeof threadStore>,
    ReturnType<typeof workspaceSettingsStore> {}

export const useStore = create<CombinedState>((...props) => ({
  ...workspaceSettingsStore(...props),
  ...ChannelMembersStore(...props),
  ...workspacesStore(...props),
  ...channelsStore(...props),
  ...channelMessagesStore(...props),
  ...pinnedMessagesStore(...props),
  ...usersPresence(...props),
  ...threadStore(...props),
}));
