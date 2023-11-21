"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserSession } from "@/shared/hooks/useAuth";
import { useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { logout, getAllChannels, TChannel } from "@/api";
import { ChannelItem } from "./ChannelItem";
import NewChannelModal from "./NewChannelModal";

export const ChannelList = () => {
  const router = useRouter();
  const session = useUserSession();
  const [channels, setChannels] = useState<TChannel[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getAllChannels();
      if (data && !error) {
        setChannels(data);
      } else if (!data && error) {
        setError(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <div className="w-1/3 bg-gray-800 text-gray-100 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="text-lg font-medium">Chats</div>
        <div className="flex items-center">
          <div className="mr-2 text-xs font-medium">{session?.user?.email}</div>
          <div onClick={handleLogout} className="w-8 h-8 bg-gray-700 rounded-full">
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
      <NewChannelModal />

      <div className="flex-1 overflow-y-auto">
        {error?.message}
        {channels?.map((item) => (
          <ChannelItem key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};
