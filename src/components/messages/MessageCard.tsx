"use client";
import { TMessage } from "@/api";
import { useUserSession } from "@/shared/hooks/useAuth";

export default function MessageCard({ data }: { data: TMessage }) {
  const session = useUserSession();

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("realtime messages")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "Messages",
  //       },
  //       () => {
  //         router.refresh();
  //       },
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase, router]);
  const isSentByCurrentUser = data?.user_id === session?.user.id;

  return (
    <div className={`flex ${isSentByCurrentUser ? "flex-row-reverse" : "flex-row"} my-2`}>
      <div className={`${isSentByCurrentUser ? "bg-blue-500" : "bg-gray-300"} rounded-lg p-3 max-w-xs break-all`}>
        <p className="text-white">{data.content}</p>
        <p className="text-black text-sm">{`@${data.edited_at}`}</p>
      </div>
    </div>
  );
}
