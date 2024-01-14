import { useStore } from "@/stores/index";
import { useMemo } from "react";

const WorkspaceCard = () => {
  const { workspaceId } = useStore((state) => state.workspaceSettings);
  const workspaces = useStore((state) => state.workspaces);
  const workspace = useMemo(() => workspaces.get(workspaceId || ""), [workspaces, workspaceId]);

  if (!workspace) return null;

  return (
    <div>
      <h1 className="mb-4 truncate text-2xl font-extrabold leading-none tracking-tight text-primary">
        {workspace.name}
      </h1>
    </div>
  );
};

export default WorkspaceCard;
