import ThemeRegistry from "@/components/theme-registry/ThemeRegistry";
import "../components/theme-registry/global.css";
import useServiceWorker from "../shared/hooks/useServiceWorker";
import { useOnAuthStateChange } from "@/api/supabase";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useServiceWorker();
  useOnAuthStateChange();

  return (
    <ThemeRegistry>
      <Component {...pageProps} />
    </ThemeRegistry>
  );
}

export default MyApp;
