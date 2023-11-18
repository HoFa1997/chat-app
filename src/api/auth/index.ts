import { supabase } from "../supabase";

export const logout = async () => await supabase.auth.signOut();
