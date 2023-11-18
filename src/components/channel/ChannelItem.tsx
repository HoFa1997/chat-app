"use client";
import Link from "next/link";
import { TChannel } from "@/api";

export const ChannelItem = ({ data }: { data: TChannel }) => {
  return (
    <Link href={`/${data.id}`}>
      <div className="p-4 hover:bg-gray-700 cursor-pointer flex flex-row">
        <div className="flex flex-col justify-start w-1/2">
          <div className="text-sm font-medium">{data.slug}</div>
          <div className="text-sm text-gray-400">{data.last_message_preview ?? "No message"}</div>
        </div>
        <div className="flex flex-col justify-end items-end w-1/2">
          <p className="text-xs text-gray-400">{new Date(data.last_activity_at).toLocaleDateString()}</p>
          <p className="text-xs text-gray-400">
            {new Date(data.last_activity_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </Link>
  );
};
