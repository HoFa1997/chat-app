"use client";
import { createBrowserClient } from "@supabase/ssr";
import { Provider } from "@supabase/supabase-js";

export default function LoginForm() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleOAuthLogin = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });
  };

  return <button onClick={() => handleOAuthLogin("google")}>Sign in with Google</button>;
}
