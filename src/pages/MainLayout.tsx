import { getAllChannels, getUser } from "@/api";

import ThemeRegistry from "@/components/theme-registry/ThemeRegistry";
import ChannelList from "@/components/channel/ChannelList";
import { createClient } from "@supabase/supabase-js";

const MainLayout = ({ children, session, user, channels }) => {
  return (
    <ThemeRegistry session={session}>
      <div style={{ display: "flex", flexDirection: "row", maxHeight: "100vh" }}>
        {session?.data?.session && <ChannelList user={session.data.session.user} channels={channels} />}
        {children}
      </div>
    </ThemeRegistry>
  );
};

export default MainLayout;
