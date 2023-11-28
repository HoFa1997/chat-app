import { getAllMessages, getUser } from "@/api";
import MessageCard from "./MessageCard";
import SendMessage from "./SendMessage";
import { cookies } from "next/headers";

export default async function MessageContainer({ channelId }: { channelId: string }) {
  const { data } = await getAllMessages(channelId);
  const cookieStore = cookies();

  const {
    data: { user },
  } = await getUser(cookieStore);

  return (
    user && (
      <div className="flex flex-col w-full pt-2 bg-background justify-between ">
        <div className="w-full h-full overflow-y-auto no-scrollbar px-4 ">
          {data?.map((item) => (
            <MessageCard key={item.id} data={item} user={user} />
          ))}
        </div>
        <SendMessage channelId={channelId} user={user} />
      </div>
    )
  );
}
