"use client";
import { supabaseClient } from "@/api/supabase";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export const AuthProvider = ({ children, session }: { children: ReactNode; session: any }) => {
  const { replace, refresh } = useRouter();
  useEffect(() => {
    if (!session) {
      replace("/unauthenticated");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const channel = supabaseClient
      .channel("realtime_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => refresh(),
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [refresh]);

  return <>{children}</>;
};
