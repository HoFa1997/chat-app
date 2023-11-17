"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TMessages } from ".";
import { createBrowserClient } from "@supabase/ssr";

export const MessageCard = async ({
  data,
  userId,
}: {
  data: TMessages;
  userId: string;
}) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
