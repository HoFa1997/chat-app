"use client";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SideBarProfile } from "./side-bar-profile";
import { useEffect, useState } from "react";
import { ChatItem } from "./chat-item";

export type TChatRoom = Database["public"]["Tables"]["ChatRooms"]["Row"];

export const SideBar = () => {
  const supabase = createClientComponentClient<Database>();

  const [chatRoom, setChatRoom] = useState<TChatRoom[] | null>(null);
  useEffect(() => {
    const fetchChatRoom = async () => {
      const user = await supabase.auth.getUser();
      if (user?.data?.user?.id) {
        const userId = user.data.user.id;
        const { data, error } = await supabase
          .from("ChatRooms")
          .select()
          .eq("user_id", userId);

        if (error) {
          setChatRoom(null);
        } else {
          setChatRoom(data);
        }
      }
    };
    fetchChatRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase.auth.getUser]);

  return (
    <div className="w-1/3 bg-gray-800 text-gray-100 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="text-lg font-medium">Chats</div>
        <SideBarProfile />
      </div>
      <div className="flex-1 overflow-y-auto">
        {chatRoom?.map((item) => (
          <ChatItem key={item.room_id} data={item} />
        ))}
      </div>
    </div>
  );
};
