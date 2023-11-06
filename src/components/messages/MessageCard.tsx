"use client";

import { Database } from "@/types/supabase";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { TMessages } from ".";
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const MessageCard = ({ data }: { data: TMessages }) => {
  const supabase = createClientComponentClient<Database>();

  const [user, setUser] = useState<Profile | null>(null);
  const [ownerUser, setOwnerUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: ownerUser, error: ownerError } =
        await supabase.auth.getUser();
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select()
        .eq("id", data.user_id!)
        .single();
      if (userError) {
        setUser(null);
      } else {
        setUser(userData);
      }
      if (ownerError) {
        setOwnerUser(null);
      } else {
        setOwnerUser(ownerUser.user);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase.auth.getUser]);

  const isSentByCurrentUser = data.user_id === ownerUser?.id;

  return (
    <div
      className={`flex ${
        isSentByCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`${
          isSentByCurrentUser ? "bg-blue-500" : "bg-gray-300"
        } rounded-lg p-3 max-w-xs break-all`}
      >
        <p className="text-white">{data.text_content}</p>
        <p className="text-black text-sm">
          {user?.full_name || `@${user?.username}`}
        </p>
      </div>
    </div>
  );
};
