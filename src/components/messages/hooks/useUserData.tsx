import { useEffect } from "react";
import { supabaseClient } from "@/api/supabase";

export const useUserData = (setUser: any, setError: any) => {
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: user } = await supabaseClient.auth.getSession();
        setUser(user?.session?.user);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchUserData();
  }, []);
};
