"use client";
import { TMessageWithUser } from "@/api";
import { User } from "@supabase/supabase-js";
import classNames from "classnames";
import Image from "next/image";

type TMessageCardProps = {
  data: TMessageWithUser;
  user: User;
};

export default function MessageCard({ data, user }: TMessageCardProps) {
  const isSentByCurrentUser = data?.user_id.id === user.id;

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
