"use client";
import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import theme from "./theme";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { SnackbarProvider } from "notistack";
import { supabaseClient } from "@/api/supabase";
import { type GetServerSidePropsContext } from "next";
import { createServerClient, type CookieOptions, serialize } from "@supabase/ssr";

export default function ThemeRegistry({ children, session }: { children: React.ReactNode; session: Session | null }) {
  const router = useRouter();
  React.useEffect(() => {
    const getSession = async () => {
      const { data } = await supabaseClient.auth.getSession();
      console.log({ data }, "====>###");
      if (!data.session) {
        router.replace("/login");
      }
    };

    getSession();

    // if (!session) {
    // replace("/login");
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
