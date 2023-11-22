import { supabaseClient } from "../supabase";

export const newChannel = async (created_by: string, slug: string) =>
  await supabaseClient.from("channels").insert({ created_by, slug }).throwOnError();
