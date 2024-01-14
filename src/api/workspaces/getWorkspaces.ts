import { Database } from "@/types/supabase";
import { supabaseClient } from "../supabase";
import { PostgrestResponse } from "@supabase/postgrest-js";
type TWorkspace = Database["public"]["Tables"]["workspaces"]["Row"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWorkspaces = async (userId: string): Promise<PostgrestResponse<any>> => {
  return (
    supabaseClient
      .from("workspaces")
      .select("*")
      .order("created_at", { ascending: true })
      // .eq("created_by", userId)
      .returns<TWorkspace[]>()
      .throwOnError()
  );
};
