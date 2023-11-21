"use client";
import { supabase } from "@/api/supabase";
import { useUserSession } from "@/shared/hooks/useAuth";
import { useState } from "react";

export default function SendMessage({ channelId }: { channelId: string }) {
  const [text, setText] = useState("");
  const session = useUserSession();

  const handleSendMessage = async () => {
    if (session && session.user.id) {
      await supabase
        .from("messages")
        .insert({
          content: text,
          channel_id: channelId,
          user_id: session.user.id,
        })
        .select();
      setText("");
    }
  };

  return (
    <div className=" flex flex-row  w-full min-h-[50px] bg-slate-50  rounded-lg overflow-hidden p-2">
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        type="text"
        className="w-full h-full rounded-lg border border-gray-300 mr-2 px-2 focus:outline-none "
        placeholder="Enter Message here!"
      />
      <button
        disabled={!text}
        onClick={handleSendMessage}
        className="p-2 bg-blue-500 rounded-lg text-white flex justify-center items-center hover:bg-blue-300 transition-all disabled:bg-gray-300"
      >
        Send
      </button>
    </div>
  );
}
