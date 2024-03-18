import { memo, useEffect } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { getWorkspaces } from "@/api";
import Link from "next/link";
import { useApi } from "@/shared/hooks/useApi";
import { useStore, useAuthStore } from "@stores/index";
import { useRouter } from "next/router";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/Tooltip";

// Workspace List Item component
const WorkspaceListItem = memo(({ workspace }: any) => {
  const router = useRouter();
  const { workspaceId } = router.query;

  const activeWorkspace = workspaceId === workspace.id ? "ring-secondary " : "ring-neutral-content";

  return (
    <li key={workspace.id} className="my-2 ">
      <Link href={`/${workspace.id}`}>
        <Tooltip placement="right">
          <TooltipTrigger asChild={true}>
            <button className="btn btn-circle">
              <Avatar
                alt={workspace.name}
                id={workspace.name}
                size={60}
                collection="initials"
                className={`h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-base-100 hover:ring-secondary ${activeWorkspace}`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent className="z-10 daisy_tooltip bg-neutral text-neutral-content">
            {workspace.name}
          </TooltipContent>
        </Tooltip>
      </Link>
    </li>
  );
});

WorkspaceListItem.displayName = "WorkspaceListItem";

const WorkspaceLists = () => {
  const profile = useAuthStore((state) => state.profile);
  const { loading, data: reqResponse, error } = useApi(getWorkspaces, profile?.id);
  const bulkSetWorkspaces = useStore((state) => state.bulkSetWorkspaces);
  const workspaces = useStore((state) => state.workspaces);

  useEffect(() => {
    if (reqResponse) {
      bulkSetWorkspaces(reqResponse);
    }
  }, [reqResponse]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <ul className="list-none">
          {Array.from(workspaces.values())?.map((workspace: any) => (
            <WorkspaceListItem key={workspace.id} workspace={workspace} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkspaceLists;
