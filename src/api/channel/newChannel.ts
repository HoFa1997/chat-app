import { supabaseClient } from "../supabase";

export const newChannel = async (created_by: string, slug: string, name: string) =>
  await supabaseClient.from("channels").insert({ created_by, slug, name }).throwOnError();
