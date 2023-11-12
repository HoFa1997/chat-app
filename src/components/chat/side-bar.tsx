import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChatItem } from "./chat-item";
import { cookies } from "next/headers";
import NewChatRoomModal from "../room/NewChatRoomModal";
import { LogoutOnProfile } from "./logout-on-profile";

export type TChatRoom = Database["public"]["Tables"]["ChatRooms"]["Row"];

export const SideBar = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data } = await supabase.from("ChatRooms").select("*");
  const { data: userData } = await supabase.auth.getUser();

  return (
    <div className="w-1/3 bg-gray-800 text-gray-100 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="text-lg font-medium">Chats</div>
        <div className="flex items-center">
          <div className="mr-2 text-sm font-medium">{userData.user?.email}</div>
          <LogoutOnProfile />
        </div>
      </div>

      <NewChatRoomModal userId={userData.user?.id!} />
      <div className="flex-1 overflow-y-auto">
        {data?.map((item) => (
          <ChatItem key={item.room_id} data={item} />
        ))}
      </div>
    </div>
  );
};
