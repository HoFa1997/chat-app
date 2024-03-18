import { TChannel } from "@/api";
import React from "react";
import { ChannelTypeIcon } from "@ui/ChannelTypeIcon";
import { Avatar } from "@ui/Avatar";
import { useRouter } from "next/router";

export const ChannelItem = ({ data, ...props }: { data: TChannel }) => {
  const { push, query } = useRouter();
  const workspaceId = query?.workspaceId?.at(0) || null;
  const channelId = query?.workspaceId?.at(1) || null;

  const lastTimUpdated = new Date(data?.last_activity_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  if (!data.id) return null;

  return (
    <li
      className="mb-1 flex w-full cursor-pointer pl-0"
      {...props}
      key={data.id}
      id={data.id}
      onClick={() => push(`/${workspaceId}/${data.id}`)}
    >
      <div className={`m-0 p-2 ${channelId === data.id && "active"}`}>
        <div className="mr-2 h-10 w-10">
          <Avatar
            className="m-0 rounded-full ring-2 ring-base-300 ring-offset-2"
            id={data.id}
            collection="shapes"
          />
        </div>
        <div className="min-w-0 grow">
          <div className="flex items-center ">
            <span className="flex items-center truncate">
              <div className="mr-2">
                <ChannelTypeIcon channelType={data.type} />
              </div>
              <span className="ml-1 truncate">{data.name}</span>
            </span>
            <span className=" ml-auto w-20 text-right ">{lastTimUpdated}</span>
          </div>
          <p className="truncate">{data.last_message_preview ?? "No message"}</p>
        </div>
      </div>
    </li>
  );
};
