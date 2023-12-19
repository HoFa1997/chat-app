import ThemeRegistry from "@/components/theme-registry/ThemeRegistry";
import "../components/theme-registry/global.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeRegistry>
      <Component {...pageProps} />
    </ThemeRegistry>
  );
}
