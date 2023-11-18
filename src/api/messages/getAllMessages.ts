import { Database } from "@/types/supabase";
import { supabase } from "../supabase";

export type TMessage = Database["public"]["Tables"]["messages"]["Row"];

export const getAllMessages = async (channelId: string) =>
  await supabase.from("messages").select("*").throwOnError().eq("channel_id", channelId);
