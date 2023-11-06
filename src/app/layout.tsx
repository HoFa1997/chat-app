import { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider, GlobalProvider } from "@/shared/providers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Chat App!",
};

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
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
        <AuthProvider session={session}>
          <GlobalProvider>{children}</GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
