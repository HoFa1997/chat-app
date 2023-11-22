import { supabaseClient } from "../supabase";

export const logout = async () => await supabaseClient.auth.signOut();
