"use client";
import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Session } from "@supabase/supabase-js";

export type TChatRoom = Database["public"]["Tables"]["ChatRooms"]["Row"];

export const SideBar = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // const { data } = await supabase.from("ChatRooms").select("*");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="w-1/3 bg-gray-800 text-gray-100 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="text-lg font-medium">Chats</div>
        <div className="flex items-center">
          <div className="mr-2 text-xs font-medium">{session?.user?.email}</div>

          <div
            onClick={handleLogout}
            className="w-8 h-8 bg-gray-700 rounded-full"
          >
            {session ? (
              <Image
                width={32}
                height={32}
                src={session.user?.user_metadata.avatar_url}
                alt="Avatar"
                className="w-full h-full rounded-full"
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* <NewChatRoomModal userId={userData.user?.id!} /> */}
      {/* <div className="flex-1 overflow-y-auto">
        {data?.map((item) => (
          <ChatItem key={item.room_id} data={item} />
        ))}
      </div> */}
    </div>
  );
};
