import { Database } from "@/types/supabase";
import { supabaseClient } from "../supabase";

type TNewChannel = Database["public"]["Tables"]["channel_members"]["Insert"];

export const join2Channel = async ({ channel_id, member_id }: TNewChannel) =>
  supabaseClient.from("channel_members").upsert({ channel_id, member_id }).select().single().throwOnError();
