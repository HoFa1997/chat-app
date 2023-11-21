"use client";
import { TMessageWithUser } from "@/api";
import { supabase } from "@/api/supabase";
import { useUserSession } from "@/shared/hooks/useAuth";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MessageCard({ data }: { data: TMessageWithUser }) {
  const session = useUserSession();
  const { refresh } = useRouter();
  useEffect(() => {
    const channel = supabase
      .channel("realtime messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          refresh();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const isSentByCurrentUser = data?.user_id.id === session?.user.id;

  return (
    <div className={`flex ${isSentByCurrentUser ? "flex-row-reverse" : "flex-row"} my-4`}>
      <div
        className={classNames("relative rounded-lg px-2 py-3 max-w-xs break-all flex justify-between items-center", {
          "bg-blue-500 flex-row": isSentByCurrentUser,
          "bg-gray-300 flex-row-reverse": !isSentByCurrentUser,
        })}
      >
        <p
          className={classNames("absolute -top-4  text-black text-xs font-extralight", {
            "right-1": isSentByCurrentUser,
            "left-1": !isSentByCurrentUser,
          })}
        >{`${data?.user_id?.username}`}</p>

        <p className="text-white pr-3">{data.content}</p>
        <div className="">
          <Image
            src={data?.user_id?.avatar_url ?? "https://avatars.dicebear.com/api/avataaars/1.svg"}
            width={32}
            height={32}
            alt="Avatar"
            className="w-8 h-8 rounded-full mr-2"
          />
        </div>
      </div>
    </div>
  );
}
