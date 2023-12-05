import { useEffect, useState } from "react";
import { supabaseClient } from "@/api/supabase";

export const useChannelData = (channelId, user, setError, setLoading) => {
  const [channelInfo, setChannelInfo] = useState(null);

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
        setLoading(false);
      }
    };

    if (channelId && user) fetchChannelData();
  }, [channelId, user]);

  return { channelInfo };
};
