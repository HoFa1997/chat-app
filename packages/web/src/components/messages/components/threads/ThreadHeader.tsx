import { IoCloseOutline } from "react-icons/io5";
import { useStore } from "@/stores";

export const ThreadHeader = () => {
  const clearThread = useStore((state: any) => state.clearThread);

  const handelCloseThread = () => {
    // Close the thread
    clearThread();
  };
  return (
    <div className="flex w-full flex-row items-center justify-start bg-base-100 py-3 px-4">
      <h5 className="m-0 font-semibold">Thread</h5>
      <div className="ml-auto">
        <button className="btn btn-circle  btn-sm" onClick={handelCloseThread}>
          <IoCloseOutline className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
