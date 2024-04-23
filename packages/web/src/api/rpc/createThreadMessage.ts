import { supabaseClient } from "@shared/utils";
import { Database } from "@/types/supabase";

type TCreateDirectMsgArg =
  Database["public"]["Functions"]["create_thread_message"]["Args"];

export const createThreadMessage = (arg: TCreateDirectMsgArg) => {
  console.log({
    arg,
  });
  return supabaseClient
    .rpc("create_thread_message", {
      p_content: arg.p_content,
      p_channel_id: arg.p_channel_id,
      p_user_id: arg.p_user_id,
      p_html: arg.p_html,
      p_thread_id: arg.p_thread_id,
    });
};
