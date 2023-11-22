import { getAllChannels, getUser } from "@/api";
import { ChannelItem } from "./ChannelItem";
import NewChannelModal from "./NewChannelModal";
import { cookies } from "next/headers";
import { UserInfoCard } from "./UserInfoCard";

export default async function ChannelList() {
  const cookieStore = cookies();
  const {
    data: { user },
  } = await getUser(cookieStore);
  const { data: channels } = await getAllChannels();

  return (
    user && (
      <div className="w-1/3 bg-gray-800 text-gray-100 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="text-lg font-medium">Chats</div>
          <UserInfoCard userData={user} />
        </div>
        <NewChannelModal userData={user} />
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {channels?.map((item) => (
            <ChannelItem key={item.id} data={item} />
          ))}
        </div>
      </div>
    )
  );
}
