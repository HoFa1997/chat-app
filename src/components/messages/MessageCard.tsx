"use client";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TMessages } from ".";

export const MessageCard = async ({
  data,
  userId,
}: {
  data: TMessages;
  userId: string;
}) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Messages",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);
  const isSentByCurrentUser = data.user_id.id === userId;

  return (
    <div
      className={`flex ${
        isSentByCurrentUser ? "flex-row-reverse" : "flex-row"
      } my-2`}
    >
      <div
        className={`${
          isSentByCurrentUser ? "bg-blue-500" : "bg-gray-300"
        } rounded-lg p-3 max-w-xs break-all`}
      >
        <p className="text-white">{data.text_content}</p>
        <p className="text-black text-sm">{`@${data.user_id.full_name}`}</p>
      </div>
    </div>
  );
};
