import "@/styles/globals.scss";

import { Metadata } from "next";
import { GlobalProvider } from "@/shared/providers";
import { cookies } from "next/headers";
import { supabaseServer } from "@/api/supabase";

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
      <body className="flex h-screen">
        <GlobalProvider session={session}>{children}</GlobalProvider>
      </body>
    </html>
  );
}
