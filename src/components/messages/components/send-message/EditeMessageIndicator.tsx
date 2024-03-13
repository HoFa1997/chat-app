import { twx, cn } from "@utils/index";
import { IoCloseOutline } from "react-icons/io5";
import { RiPencilFill } from "react-icons/ri";
import { useStore } from "@stores/index";

type BtnIcon = React.ComponentProps<"button"> & { $active?: boolean; $size?: number };

const IconButton = twx.button<BtnIcon>((props) =>
  cn(
    "btn btn-circle w-8 h-8 btn-xs p-1 mr-2",
    props.$active && "btn-active",
    props.$size && `w-${props.$size} h-${props.$size}`,
  ),
);

export const EditeMessageIndicator = () => {
  const setEditeMessageMemory = useStore((state) => state.setEditeMessageMemory);
  const { editeMessageMemory } = useStore((state: any) => state.workspaceSettings);

  const handleCloseEditeMessage = () => {
    setEditeMessageMemory(null);
  };

  const replyToUser =
    editeMessageMemory?.user_details?.fullname || editeMessageMemory?.user_details?.username || "";

  if (!editeMessageMemory) return null;

  return (
    <div className="flex w-full  items-center justify-between px-4 py-2 text-base-content">
      <RiPencilFill size={24} />
      <div className="flex w-full flex-col justify-start pl-3 text-base text-base-content">
        <span className="font-semibold text-primary antialiased">
          Edite message
          <span className=" ml-1 font-normal">{replyToUser}</span>
        </span>
        <span className="text-sm">{editeMessageMemory?.content}</span>
      </div>
      <IconButton onClick={handleCloseEditeMessage}>
        <IoCloseOutline size={22} />
      </IconButton>
    </div>
  );
};
