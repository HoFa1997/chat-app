import ChannelList from "@/components/channel/ChannelList";
import { Session } from "@supabase/supabase-js";
import { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";

type Props = {
  children: ReactNode | ReactNode[];
  session: Session | null;
};

export const GlobalProvider: React.FC<Props> = ({ children, session }) => {
  return (
    <>
      {session && <ChannelList />}
      <AuthProvider session={session}>{children}</AuthProvider>
    </>
  );
};
