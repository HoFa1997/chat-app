import type { AppProps } from "next/app";
import useServiceWorker from "@/shared/hooks/useServiceWorker";
import { Toaster } from "react-hot-toast";
import { useOnAuthStateChange } from "@/shared/hooks/useOnAuthStateChange";
import { useCatchUserPresences } from "@/shared/hooks/useCatchUserPresences";
import { useBroadcastListner } from "@/shared/hooks/useBroadcastListner";
import "@/styles/globals.scss";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useServiceWorker();
  useOnAuthStateChange();
  useCatchUserPresences();
  useBroadcastListner();

  return (
    <div id="root">
      <Component {...pageProps} />
      <Toaster />
    </div>
  );
};

export default MyApp;
