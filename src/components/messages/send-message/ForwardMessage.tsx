import { CloseIcon, ForwardIcon, ReplayIcon } from "@/shared/assets";
import { setForwardMessage, useForwardMessageInfo } from "@/shared/hooks";

export const ForwardMessage = () => {
  const forwardedMessage = useForwardMessageInfo();

  const handleCloseForwardedMessage = () => {
    setForwardMessage(null);
  };

  if (!forwardedMessage) return null;

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
      <ForwardIcon className="h-6 w-6 fill-white" />
      <div className="flex grow flex-col items-start justify-start pl-3">
        <p className="text-xs text-white">FORWARD MESSAGE TODO : {forwardedMessage?.user_id.username}</p>
        <p className="text-lg text-white">{forwardedMessage?.content}</p>
      </div>
      <button onClick={handleCloseForwardedMessage}>
        <CloseIcon className="h-6 w-6 rounded-full bg-white fill-black" />
      </button>
    </div>
  );
};
