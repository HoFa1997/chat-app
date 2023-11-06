"use client";
import { MessageCard } from "@/components";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

export type TMessages = Database["public"]["Tables"]["Messages"]["Row"];

export const MessageContainer = ({ chatRoomId }: { chatRoomId: string }) => {
  const supabase = createClientComponentClient<Database>();

  const [messages, setMessages] = useState<TMessages[] | null>(null);
  useEffect(() => {
    const fetchChatRoom = async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from("Messages")
        .select()
        .eq("room_id", chatRoomId)
        .order("created_at");

      if (messagesError) {
        setMessages(null);
      } else {
        setMessages(messagesData);
      }
    };
    fetchChatRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase.auth.getUser]);

  return (
    <div className="flex flex-col w-full p-11 bg-gray-400">
      {messages?.map((item) => (
        <MessageCard data={item} key={item.message_id} />
      ))}
    </div>
  );
};
