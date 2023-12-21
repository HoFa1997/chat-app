import ThemeRegistry from "@/components/theme-registry/ThemeRegistry";
import "../components/theme-registry/global.css";
import useServiceWorker from "../shared/hooks/useServiceWorker";
import { supabaseClient, useAuthStore } from "@/api/supabase";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useServiceWorker();
  useEffect(() => {
    // Listen to Supabase authentication changes
    supabaseClient?.auth?.onAuthStateChange((event, session) => {
      session && useAuthStore.getState().setUser(session?.user || null);
    });
  }, []);

  return (
    <ThemeRegistry>
      <Component {...pageProps} />
    </ThemeRegistry>
  );
}

export default MyApp;
