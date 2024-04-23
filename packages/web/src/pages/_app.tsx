import type { AppProps } from "next/app";
import useServiceWorker from "@/shared/hooks/useServiceWorker";
import { Toaster } from "react-hot-toast";
import { useOnAuthStateChange } from "@/shared/hooks/useOnAuthStateChange";
import { useCatchUserPresences } from "@/shared/hooks/useCatchUserPresences";
import { useBroadcastListner } from "@/shared/hooks/useBroadcastListner";
import "@/styles/globals.scss";
import data from "@emoji-mart/data/sets/14/native.json";
import { init } from "emoji-mart";
import { useHandleUserStatus } from "@/shared/hooks";
init({ data });

const MyApp = ({ Component, pageProps }: AppProps) => {
  useServiceWorker();
  useOnAuthStateChange();
  useCatchUserPresences();
  useBroadcastListner();
  useHandleUserStatus();

  init({ data });

  return (
    <div id="root">
      <Component {...pageProps} />
      <Toaster />
    </div>
  );
};

export default MyApp;
