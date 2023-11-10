import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { SideBarProfile } from "./side-bar-profile";
import { ChatItem } from "./chat-item";
import { cookies } from "next/headers";

export type TChatRoom = Database["public"]["Tables"]["ChatRooms"]["Row"];

export const SideBar = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data } = await supabase.from("ChatRooms").select("*");

  return (
    <div className="w-1/3 bg-gray-800 text-gray-100 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="text-lg font-medium">Chats</div>
        <SideBarProfile />
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-4">
        New Chat Room
      </button>
      <div className="flex-1 overflow-y-auto">
        {data?.map((item) => (
          <ChatItem key={item.room_id} data={item} />
        ))}
      </div>
    </div>
  );
};
