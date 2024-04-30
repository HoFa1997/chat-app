import { useRef } from "react";
import { ChannelItem } from "./ChannelItem";
import NewChannelModal from "./NewChannelModal";
import FilterBar from "./FilterBar";
import { useAuthStore } from "@stores/index";
import WorkspaceCard from "./WorkspaceCard";
import { useResizeChannelList } from "./useResizeChannelList";
import { useChannelFilter } from "./useChannelFilter";
import { useTypingIndicator } from "./useTypingIndicator";

export default function ChannelList({ loading = false }) {
  const user = useAuthStore((state) => state.profile);
  const panelRef = useRef<any>(null);

  const { onMouseDown } = useResizeChannelList({ panelRef });
  const { filteredChannels, handleFilterChange, channels } = useChannelFilter();
  useTypingIndicator();

  if (!user) return null;

  return (
    <div
      ref={panelRef}
      className="relative flex h-dvh w-3/12 flex-col border-r bg-base-200 p-4 text-base-content"
    >
      <WorkspaceCard />
      {channels.size > 0 && (
        <>
          <FilterBar onFilterChange={handleFilterChange} />
          <NewChannelModal />
        </>
      )}
      {loading ? (
        <div className="flex size-full items-center justify-center overflow-hidden">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <div className=" mt-2 h-svh overflow-y-auto">
          {filteredChannels?.length === 0 && (
            <div className="flex size-full flex-col items-center justify-center overflow-hidden">
              <span className="font-semibold antialiased">No Channels Found</span>
              <span className="my-4 text-center text-sm">
                It looks like there are no channels available. Start by creating a new channel!
              </span>
              <NewChannelModal />
            </div>
          )}
          <ul className="channleList menu m-0 h-auto rounded-box bg-base-200 p-0">
            {filteredChannels?.map(
              (item: any, index: number) =>
                item && <ChannelItem key={item.id + index} data={item} />,
            )}
          </ul>
        </div>
      )}

      <div
        className="absolute right-0 top-0 h-full w-1 cursor-ew-resize select-none bg-base-300 transition-all hover:bg-base-100"
        onMouseDown={onMouseDown}
      />
    </div>
  );
}
