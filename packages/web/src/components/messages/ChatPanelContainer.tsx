import { ChannelProvider } from "@/shared/context/ChannelProvider";
import { useStore } from "@stores/index";
import { ChatRoom } from "./ChatRoom";
import { useChatContainerResizeHandler } from "./hooks";
import ThreadMessageCard from "./components/chatContainer/ThreadMessageCard";
import { ThreadHeader } from "./components/threads/ThreadHeader";

const ThreadChannelSettings = {
  displayChannelBar: false,
  displaySystemNotifyChip: false,
  contextMenue: {
    replyInThread: false,
    pin: false,
  },
};

export const ChatPanelContainer = () => {
  const startThreadMessage = useStore((state) => state.startThreadMessage);
  const { activeChannelId } = useStore((state) => state.workspaceSettings);

  const { onMouseDown, leftWidth, panelRef } = useChatContainerResizeHandler();

  if (!activeChannelId) return null;

  return (
    <div className="flex size-full w-full flex-row">
      {/* Main channel */}
      <div ref={panelRef} style={{ width: `${leftWidth}%`, display: "flex" }}>
        <ChannelProvider initChannelId={activeChannelId || ""}>
          <ChatRoom className="">
            <div
              className="resize-handle absolute right-0 top-0 h-full w-1 cursor-ew-resize select-none bg-base-300 transition-all hover:bg-base-100"
              onMouseDown={onMouseDown}
            />
          </ChatRoom>
        </ChannelProvider>
      </div>

      {/* Thread channel */}
      {startThreadMessage && (
        <div className="flex flex-col " style={{ width: `${100 - leftWidth}%` }}>
          <ChannelProvider
            initChannelId={startThreadMessage.id}
            initSettings={ThreadChannelSettings}
          >
            <ThreadHeader />
            <ThreadMessageCard data={startThreadMessage} />
            <ChatRoom className="border-t pt-1" />
          </ChannelProvider>
        </div>
      )}
    </div>
  );
};
