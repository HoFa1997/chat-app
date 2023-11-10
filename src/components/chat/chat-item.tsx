import Link from "next/link";
import { TChatRoom } from ".";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";
type TMessage = Database["public"]["Tables"]["Messages"]["Row"];
export const ChatItem = async ({ data }: { data: TChatRoom }) => {
  const supabase = createServerComponentClient({ cookies });
  const { data: lastMessage } = await supabase
    .from("Messages")
    .select()
    .eq("room_id", data.room_id)
    .order("created_at", { ascending: false })
    .limit(1);

  const createdAt = new Date(
    (lastMessage as TMessage[])[0].created_at
  ).toLocaleDateString();

  return (
    <Link href={`/chat/${data.room_id}`}>
      <div className="p-4 hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{data.room_name}</div>
          <div className="text-xs text-gray-400">{createdAt}</div>
        </div>
        <div className="text-sm text-gray-400">
          {(lastMessage as TMessage[])[0].text_content}
        </div>
      </div>
    </Link>
  );
};
