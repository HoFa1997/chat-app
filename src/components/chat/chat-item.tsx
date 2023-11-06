import Link from "next/link";
import { TChatRoom } from ".";

export const ChatItem = ({ data }: { data: TChatRoom }) => {
  const createdAt = new Date(data.created_at).toLocaleDateString();

  return (
    <Link href={`/chat/${data.room_id}`}>
      <div className="p-4 hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{data.room_name}</div>
          <div className="text-xs text-gray-400">{createdAt}</div>
        </div>
        <div className="text-sm text-gray-400">{data.user_id}</div>
      </div>
    </Link>
  );
};
