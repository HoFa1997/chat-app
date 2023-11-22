"use client";
import { supabaseClient } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

type SendMessageProps = {
  channelId: string;
  user: User;
};

export default function SendMessage({ channelId, user }: SendMessageProps) {
  const [text, setText] = useState("");

  const handleSendMessage = async () => {
    await supabaseClient
      .from("messages")
      .insert({
        content: text,
        channel_id: channelId,
        user_id: user.id,
      })
      .select();
    setText("");
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
