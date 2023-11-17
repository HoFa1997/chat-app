"use client";
import Link from "next/link";
import { TChatRoom } from ".";
import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
type TMessage = Database["public"]["Tables"]["Messages"]["Row"];
export const ChatItem = async ({ data }: { data: TChatRoom }) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: lastMessage } = await supabase
    .from("Messages")
    .select()
    .eq("room_id", data.room_id)
    .order("created_at", { ascending: false })
    .limit(1);

  const createdAt = new Date(
    (lastMessage as TMessage[])[0]?.created_at
  )?.toLocaleDateString();

  return (
    <Link href={`/${data.room_id}`}>
      <div className="p-4 hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{data.room_name}</div>
          <div className="text-xs text-gray-400">
            {createdAt === "Invalid Date" ? "" : createdAt}
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {(lastMessage as TMessage[])[0]?.text_content ?? ""}
        </div>
      </div>
    </Link>
  );
};
