import { immer } from "zustand/middleware/immer";

import { Database } from "@/types/supabase";

export type TWorkspace = Database["public"]["Tables"]["workspaces"]["Row"];

export interface IWorkspacesStore {
  workspaces: Map<string, TWorkspace>;
  setOrUpdateWorkspace: (workspaceId: string, workspaceData: any) => void;
  removeWorkspace: (workspaceId: string) => void;
  bulkSetWorkspaces: (workspaces: Array<TWorkspace>) => void;
  clearWorkspaces: () => void;
}

const workspacesStore = immer<IWorkspacesStore>((set) => ({
  workspaces: new Map(),

  setOrUpdateWorkspace: (workspaceId, workspaceData) => {
    set((state) => {
      state.workspaces.set(workspaceId, workspaceData);
    });
  },

  removeWorkspace: (workspaceId) => {
    set((state) => {
      state.workspaces.delete(workspaceId);
    });
  },

  clearWorkspaces: () => {
    set((state) => {
      state.workspaces = new Map();
    });
  },

  bulkSetWorkspaces: (workspaces) => {
    set((state) => {
      workspaces.forEach((workspace) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.workspaces.set(workspace.id, workspace);
      });
    });
  },
}));

export default workspacesStore;
