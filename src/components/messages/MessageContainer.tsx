"use client";
import { useEffect, useState } from "react";
import { TMessage, TMessageWithUser, getAllMessages } from "@/api";
import MessageCard from "./MessageCard";
import SendMessage from "./SendMessage";

export default function MessageContainer({ channelId }: { channelId: string }) {
  const [messages, setMessages] = useState<TMessageWithUser[] | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getAllMessages(channelId);
      setMessages(data);
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full px-4 py-2 bg-gray-400 justify-between ">
      <div className="w-full h-full overflow-y-auto no-scrollbar">
        {messages?.map((item) => (
          <MessageCard key={item.id} data={item} />
        ))}
      </div>
      <SendMessage channelId={channelId} />
    </div>
  );
}
