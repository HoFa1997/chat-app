import { Database } from "@/types/supabase";
import { supabaseClient } from "../supabase";

export type TUser = Database["public"]["Tables"]["users"]["Row"];

export const getUser = async (userId: string) =>
  await supabaseClient.from("users").select("*").eq("id", userId).returns<TUser>().single();
