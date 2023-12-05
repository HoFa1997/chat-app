import { useEffect, useState } from "react";
import { supabaseClient } from "@/api/supabase";

export const useChannelMemmberData = (
  channelId: any,
  user: any,
  setError: any,
  setLoading: any,
  setChannelMembers: any,
) => {
  const [isChannelMember, setIsChannelMember] = useState(false);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const { data: channelMembers, error } = await supabaseClient
          .from("channel_members")
          .select("*, member_id(username , id , avatar_url)")
          .eq("channel_id", channelId);

        if (error) throw error;

        if (channelMembers) {
          const newChannelMembers = new Map();
          channelMembers.forEach((x: any) => newChannelMembers.set(x.member_id.id, { ...x, ...x.member_id }));
          setChannelMembers(newChannelMembers);

          if (newChannelMembers.has(user?.id)) {
            setIsChannelMember(true);
          }
        }
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (channelId && user) fetchChannelData();
  }, [channelId, user]);

  return { isChannelMember, setIsChannelMember };
};
