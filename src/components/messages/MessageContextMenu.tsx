import { TMessageWithUser } from "@/api";
import { DeleteIcon, PinIcon, ReplayIcon, ForwardIcon } from "@/shared/assets";
import { TUseContextMenu, setForwardMessage, setReplayMessage } from "@/shared/hooks";

export const MessageContextMenu = ({
  props: { menuRef, menuState, closeMenu },
  messageData,
}: {
  props: TUseContextMenu;
  messageData: TMessageWithUser;
}) => {
  const handelReplayMessage = () => {
    if (messageData) {
      setReplayMessage(messageData);
      closeMenu();
    }
  };

  const handelForwardMessage = () => {
    if (messageData) {
      setForwardMessage(messageData);
      closeMenu();
    }
  };

  const messageButtonList = [
    {
      title: "Replay",
      icon: <ReplayIcon />,
      onClickFn: handelReplayMessage,
    },
    {
      title: "Forward",
      icon: <ForwardIcon />,
      onClickFn: handelForwardMessage,
    },
    {
      title: "Pin",
      icon: <PinIcon />,
      onClickFn: () => closeMenu(),
    },
    {
      title: "Delete",
      icon: <DeleteIcon />,
      onClickFn: () => closeMenu(),
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute flex flex-col items-start justify-start overflow-hidden rounded bg-white shadow-md"
      style={{ top: `${menuState.y}px`, left: `${menuState.x}px` }}
    >
      {messageButtonList.map((item) => (
        <div
          className="flex w-full cursor-pointer flex-row items-center justify-start px-2 py-1 hover:bg-gray-200"
          key={item.title}
          onClick={item.onClickFn}
        >
          <div className="flex items-center justify-center pr-2">{item.icon}</div>
          {item.title}
        </div>
      ))}
    </div>
  );
};
