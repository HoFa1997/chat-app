import React, { useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { useRouter } from "next/router";
import { supabaseClient } from "@/api/supabase";

import NextAppDirEmotionCacheProvider from "./EmotionCache";
import theme from "./theme";

interface ThemeRegistryProps {
  children: React.ReactNode;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  const router = useRouter();

  useEffect(() => {
    async function checkSessionAndRedirect() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        // Use the replace method to ensure there's no back button to the _app without session
        router.replace("/login");
      }
    }

    checkSessionAndRedirect();
  }, []);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
