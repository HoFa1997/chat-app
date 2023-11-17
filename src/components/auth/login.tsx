"use client";
import { createBrowserClient } from "@supabase/ssr";
import { Provider } from "@supabase/supabase-js";

export default function LoginForm() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleOAuthLogin = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <button
        className={`${"bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        onClick={() => handleOAuthLogin("google")}
      >
        Sign in with Google
      </button>
    </div>
  );
}
