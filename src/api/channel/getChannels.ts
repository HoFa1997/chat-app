import { supabaseClient } from "../supabase";
import { Database } from "@/types/supabase";

export type TChannel = Database["public"]["Tables"]["channels"]["Row"];

export const getAllChannels = async () =>
  await supabaseClient.from("channels").select("*").order("last_activity_at", { ascending: false }).throwOnError();
