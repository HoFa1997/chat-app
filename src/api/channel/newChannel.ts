import { supabase } from "../supabase";

export const newChannel = async (created_by: string, slug: string) =>
  await supabase.from("channels").insert({ created_by, slug }).throwOnError();
