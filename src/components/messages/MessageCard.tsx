"use client";
import { TMessageWithUser } from "@/api";
import { getColorFromClass } from "@/shared/utils";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

type TMessageCardProps = {
  data: TMessageWithUser;
  user: User;
};

export default function MessageCard({ data, user }: TMessageCardProps) {
  return (
    <div className={"flex flex-row my-4 "}>
      <Image
        src={data?.user_id?.avatar_url ?? "https://avatars.dicebear.com/api/avataaars/1.svg"}
        width={40}
        height={40}
        alt="Avatar"
        className="w-10 h-10 rounded-full mr-2"
      />
      <div className="flex flex-col items-start">
        <p className={`text-xs`} style={{ color: getColorFromClass(data.user_id.username) }}>
          {data.user_id.username}
        </p>
        <p className="text-base text-primary-text">{data.content}</p>
      </div>
    </div>
  );
}
