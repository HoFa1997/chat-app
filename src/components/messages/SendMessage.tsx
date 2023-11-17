"use client";
import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

export const SendMessage = ({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [text, setText] = useState("");

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
        onClick={async () => {
          await supabase.from("Messages").insert({
            user_id: userId,
            text_content: text,
            room_id: +roomId,
          });
          setText("");
        }}
        className="p-2 bg-blue-500 rounded-lg text-white flex justify-center items-center hover:bg-blue-300 transition-all "
      >
        Send
      </button>
    </div>
  );
};
