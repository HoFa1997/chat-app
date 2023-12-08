import { supabaseClient } from "@/api/supabase";
import { useState, useEffect } from "react";

export const useGetUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        if (session) {
          setUserId(session?.user.id);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  return userId;
};
