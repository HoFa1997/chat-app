import { DeleteIcon, PinIcon, UnPinIcon, ReplayIcon, ForwardIcon } from "@/shared/assets";
import { TUseContextMenu } from "@/shared/hooks";

export const MessageContextMenu = ({ props: { menuRef, menuState, closeMenu } }: { props: TUseContextMenu }) => {
  const messageButtonList = [
    {
      title: "Replay",
      icon: <ReplayIcon />,
      onClickFn: () => closeMenu(),
    },
    {
      title: "Forward",
      icon: <ForwardIcon />,
      onClickFn: () => closeMenu(),
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
      className="absolute bg-white shadow-md rounded flex flex-col justify-start items-start overflow-hidden"
      style={{ top: `${menuState.y}px`, left: `${menuState.x}px` }}
    >
      {messageButtonList.map((item) => (
        <div
          className="px-2 py-1 flex w-full flex-row justify-start items-center cursor-pointer hover:bg-gray-200"
          key={item.title}
          onClick={item.onClickFn}
        >
          <div className="flex justify-center items-center pr-2">{item.icon}</div>
          {item.title}
        </div>
      ))}
    </div>
  );
};
