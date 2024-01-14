import { Database } from "@/types/supabase";
import { supabaseClient } from "../supabase";
import { PostgrestSingleResponse } from "@supabase/postgrest-js";
export type TWorkspaceInsert = Database["public"]["Tables"]["workspaces"]["Insert"];
export type TWorkspaceRow = Database["public"]["Tables"]["workspaces"]["Row"];

export const createWorkspace = async (arg: TWorkspaceInsert): Promise<PostgrestSingleResponse<TWorkspaceRow>> => {
  return supabaseClient
    .from("workspaces")
    .insert({ ...arg })
    .select()
    .single()
    .throwOnError();
};
