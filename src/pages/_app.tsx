import ThemeRegistry from "@/components/theme-registry/ThemeRegistry";
import "../components/theme-registry/global.css";
import { useServiceWorker } from "../hooks/useServiceWorker";

export default function MyApp({ Component, pageProps }) {
  useServiceWorker();
  return (
    <ThemeRegistry>
      <Component {...pageProps} />
    </ThemeRegistry>
  );
}
