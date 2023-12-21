import { ChatContainer } from "@/components/chat";
import { Box } from "@mui/material";
import React from "react";
import { type GetServerSidePropsContext } from "next";
import { createServerClient, type CookieOptions, serialize } from "@supabase/ssr";
import ChannelList from "@/components/channel/ChannelList";

import { useAuthStore } from "@/api/supabase";

export default function Page({ channels }) {
  const user = useAuthStore.use.user();

  return (
    <Box>
      <div style={{ display: "flex", flexDirection: "row", maxHeight: "100vh" }}>
        {user && <ChannelList user={user} channels={channels} />}
        <ChatContainer />
      </div>
    </Box>
  );
}

// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return context.req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          context.res.appendHeader("Set-Cookie", serialize(name, value, options));
        },
        remove(name: string, options: CookieOptions) {
          context.res.appendHeader("Set-Cookie", serialize(name, "", options));
        },
      },
    },
  );

  const { data: channels } = await supabase.from("channels").select("*").order("id", { ascending: true });

  return {
    props: { channels },
  };
};
