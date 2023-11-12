import { MessageCard } from "@/components";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { SendMessage } from "./SendMessage";
import { cookies } from "next/headers";

export type TProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type TMessages = Omit<
  Database["public"]["Tables"]["Messages"]["Row"],
  "user_id"
> & {
  user_id: TProfile;
};

export const MessageContainer = async ({
  chatRoomId,
}: {
  chatRoomId: string;
}) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: messagesData } = await supabase
    .from("Messages")
    .select(`*, user_id (*)`)
    .eq("room_id", chatRoomId)
    .order("created_at");

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex flex-col w-full px-4 py-2 bg-gray-400 justify-between ">
      <div className="w-full h-full overflow-y-auto no-scrollbar">
        {messagesData?.map((item: any) => (
          <MessageCard
            data={item}
            key={item.message_id}
            userId={session?.user.id!}
          />
        ))}
      </div>
      <SendMessage userId={session?.user.id!} roomId={chatRoomId} />
    </div>
  );
};
