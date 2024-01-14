import { Database } from "@/types/supabase";
import { supabaseClient } from "../supabase";

export type TNewChannel = Database["public"]["Tables"]["channels"]["Insert"];

export const newChannel = async (newChannelPayload: TNewChannel) =>
  await supabaseClient.from("channels").insert(newChannelPayload).select().single().throwOnError();
