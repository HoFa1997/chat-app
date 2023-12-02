import { Metadata } from "next";
import { cookies } from "next/headers";
import { supabaseServer } from "@/api/supabase";
import ThemeRegistry from "@/components/theme-registry/ThemeRegistry";
import ChannelList from "@/components/channel/ChannelList";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Chat App!",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const supabase = supabaseServer(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <ThemeRegistry session={session}>
          <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
            {session && <ChannelList />}
            {children}
          </div>
        </ThemeRegistry>
      </body>
    </html>
  );
}
