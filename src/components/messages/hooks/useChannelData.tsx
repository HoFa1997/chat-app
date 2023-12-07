import { useEffect, useState } from "react";
import { supabaseClient } from "@/api/supabase";

import { Database } from "@/types/supabase";
export type TChannels = Database["public"]["Tables"]["channels"]["Row"];

export const useChannelData = (channelId: any, user: any, setError: any) => {
  const [channelInfo, setChannelInfo] = useState<TChannels | null>();

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const { data: channelInfo, error } = await supabaseClient
          .from("channels")
          .select("*")
          .eq("id", channelId)
          .single();

        if (error) throw error;

        setChannelInfo(channelInfo);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
      }
    };

    if (channelId && user) fetchChannelData();
  }, [channelId, user]);

  return { channelInfo };
};
