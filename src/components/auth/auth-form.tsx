"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

export default function SignupForm() {
  const supabase = createClientComponentClient<Database>();
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-slate-400">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-[400px]">
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          showLinks={false}
          providers={["github", "google"]}
          redirectTo="http://localhost:3000/auth/callback"
        />
      </div>
    </div>
  );
}
