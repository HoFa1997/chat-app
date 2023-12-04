import { supabaseClient } from "../supabase";
import { Database } from "@/types/supabase";

export type TChannel = Database["public"]["Tables"]["channels"]["Row"];

export const getAllChannels = async () =>
  await supabaseClient
    .from("channels")
    .select("*")
    .order("last_activity_at", { ascending: false })
    .returns<TChannel[]>()
    .throwOnError();

export const getChannelById = async (channelId: string) =>
  await supabaseClient.from("channels").select("*").eq("id", channelId).returns<TChannel>().single().throwOnError();
