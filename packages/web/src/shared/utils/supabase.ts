import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Initialize Supabase
export const supabaseClient = createClientComponentClient({
  options: {
    // @ts-ignore
    isSingleton: true,
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
});
