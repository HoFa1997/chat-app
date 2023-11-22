"use client";
import { logout } from "@/api";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";

type UserInfoCardProps = {
  userData: User;
};

export const UserInfoCard = ({ userData: user }: UserInfoCardProps) => {
  const { refresh } = useRouter();
  const handleLogout = async () => {
    await logout();
    refresh();
  };
  return (
    <div className="flex items-center">
      <div className="mr-2 text-xs font-medium">{user?.email}</div>
      <div onClick={handleLogout} className="w-8 h-8 bg-gray-700 rounded-full">
        {user ? (
          <Image
            width={32}
            height={32}
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-full h-full rounded-full"
          />
        ) : null}
      </div>
    </div>
  );
};
