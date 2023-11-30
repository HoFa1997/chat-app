import { getAllMessages, getUser } from "@/api";
import MessageCard from "./MessageCard";
import { cookies } from "next/headers";
import SendMessage from "./send-message/SendMessage";

export default async function MessageContainer({ channelId }: { channelId: string }) {
  const { data } = await getAllMessages(channelId);
  const cookieStore = cookies();

  const {
    data: { user },
  } = await getUser(cookieStore);

  return (
    user && (
      <div className="flex w-full flex-col justify-between bg-background pt-2 ">
        <div className="no-scrollbar flex flex-col overflow-y-auto px-4">
          {data?.map((item) => <MessageCard key={item.id} data={item} user={user} />)}
        </div>
        <SendMessage channelId={channelId} user={user} />
      </div>
    )
  );
}
