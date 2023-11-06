"use client";
import { Database } from "@/types/supabase";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export const SideBarProfile = () => {
  const supabase = createClientComponentClient<Database>();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setUser(null);
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase.auth.getUser]);

  return (
    <div className="flex items-center">
      <div className="mr-2 text-sm font-medium">{user?.email}</div>
      <div className="w-8 h-8 bg-gray-700 rounded-full">
        {/* {user ? (
          <img
            src={user.avatar_url}
            alt="Avatar"
            className="w-full h-full rounded-full"
          />
        ) : null} */}
      </div>
    </div>
  );
};
