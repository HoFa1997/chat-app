import { setReplayMessage, useReplayMessageInfo } from "@/shared/hooks";
import CloseIcon from "@mui/icons-material/CloseRounded";
import ReplayIcon from "@mui/icons-material/ReplyRounded";
export const ReplayMessage = () => {
  const replayedMessage = useReplayMessageInfo();

  const handleCloseReplayMessage = () => {
    setReplayMessage(null);
  };

  if (!replayedMessage) return null;

  return (
    <div
      className={`
          flex
          min-h-[60px]
          w-full
          flex-row
          items-center
          justify-between
          border-b
        border-gray-500 bg-menu-background
          px-4 py-2
        text-primary-text
        `}
    >
      <ReplayIcon className="h-6 w-6 fill-white" />
      <div className="flex grow flex-col items-start justify-start pl-3">
        <p className="text-xs text-white">Reply to {replayedMessage?.user_id.username}</p>
        <p className="text-lg text-white">{replayedMessage?.content}</p>
      </div>
      <button onClick={handleCloseReplayMessage}>
        <CloseIcon className="h-6 w-6 rounded-full bg-white fill-black" />
      </button>
    </div>
  );
};
