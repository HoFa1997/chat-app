import { supabaseClient } from "@shared/utils";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

type TUser = Database["public"]["Tables"]["users"]["Update"];

export const updateUser = async (
  id: string,
  update: TUser,
): Promise<PostgrestSingleResponse<null>> => {
  return supabaseClient.from("users").update({ ...update }).eq("id", id)
    .single()
    .throwOnError();
};
