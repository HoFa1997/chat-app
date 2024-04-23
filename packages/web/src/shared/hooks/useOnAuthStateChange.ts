import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@stores/index";
import { supabaseClient } from "@shared/utils";
import { getUserById } from "@/api";
import { useApi } from "./useApi";

export const useOnAuthStateChange = () => {
  const router = useRouter();
  const setLoading = useAuthStore((state) => state.setLoading);
  const { request: getUserByIdRequest } = useApi(getUserById, null, false);

  const getUserProfile = useCallback(async (user: any) => {
    const { data, error } = (await getUserByIdRequest(user.id)) as any;
    if (error) throw error;
    // set display name, we have to read diplay name from auth store
    const displayName = data?.display_name ||
      data?.username ||
      data?.email.split("@")[0] ||
      user?.email?.split("@")[0];

    useAuthStore.getState().setDisplayName(displayName);
    useAuthStore.getState().setProfile({ ...data });
    setLoading(false);
  }, []);

  // Handle auth state changes
  useEffect(() => {
    setLoading(true);
    const { data } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        if (!session?.user) router.push("/login");
      }

      if (
        event === "SIGNED_IN" || event === "INITIAL_SESSION" ||
        event === "USER_UPDATED"
      ) {
        if (!session?.user) return;
        const user = useAuthStore.getState().profile;
        if (user?.id !== session?.user?.id) {
          useAuthStore.getState().setSession(session?.user || null);
          if (session?.user) getUserProfile(session?.user);
          setLoading(false);
        }
        // if user is in login page, redirect to home page
        if (location.pathname === "/login") router.push("/");
      }
      if (event === "SIGNED_OUT") {
        useAuthStore.getState().setSession(null);
        useAuthStore.getState().setProfile(null);
        router.push("/login");
        setLoading(false);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabaseClient]);
};
