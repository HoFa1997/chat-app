import "@/styles/globals.css";
import { Metadata } from "next";
import { GlobalProvider } from "@/shared/providers";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Chat App!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <GlobalProvider session={session}>{children}</GlobalProvider>
      </body>
    </html>
  );
}
