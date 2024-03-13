import { supabaseClient } from "@shared/utils";
import { AuthError } from "@supabase/supabase-js";

// Refactored logout function
export const logout = async (): Promise<{ data: null; error: AuthError | null }> => {
  const { error } = await supabaseClient.auth.signOut();
  return { data: null, error };
};
