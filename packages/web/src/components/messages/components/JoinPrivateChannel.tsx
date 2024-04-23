import { useStore } from "@stores/index";
import { useAuthStore } from "@stores/index";

export default function JoinPrivateChannel() {
  const { channelId } = useStore((state: any) => state.workspaceSettings);
  const user = useAuthStore((state) => state.profile);

  if (!user || !channelId) return null;

  return (
    <div className="flex w-full flex-col items-center justify-center p-2">
      <div className="btn btn-block">
        It's a private channel, Users can join only by invitation or approval.
      </div>
    </div>
  );
}
