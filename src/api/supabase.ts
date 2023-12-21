import { Database } from "@/types/supabase";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { createClient } from "@supabase/supabase-js";
import { create } from "zustand";
import createSelectors from "./zustand.ts";

// export const supabaseClient = createBrowserClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// );

export const supabaseServer = (cookieStore: ReadonlyRequestCookies) =>
  createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });

// Initialize Supabase
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
    },
  },
);

// Create Zustand store for authentication state
const AuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useAuthStore = createSelectors(AuthStore);
