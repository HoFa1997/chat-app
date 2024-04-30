import { supabaseClient } from "@shared/utils";
import { Database } from "@/types/supabase";

type TCreateDirectMsgArg = Database["public"]["Functions"]["create_thread_message"]["Args"];

export const create_thread_message = async (arg: TCreateDirectMsgArg) =>
  await supabaseClient.rpc("create_thread_message", {
    p_content: arg.p_content,
    p_html: arg.p_html,
    p_thread_id: arg.p_thread_id,
    p_workspace_id: arg.p_workspace_id,
  });
