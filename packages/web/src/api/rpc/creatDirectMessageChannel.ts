import { supabaseClient } from "@shared/utils";
import { Database } from "@/types/supabase";

type TCreateDirectMsgArg =
  Database["public"]["Functions"]["create_direct_message_channel"]["Args"];
type TCreateDirectMsgReturn =
  Database["public"]["Functions"]["create_direct_message_channel"]["Returns"];

export const creatDirectMessageChannel = (arg: TCreateDirectMsgArg) => {
  return supabaseClient
    .rpc("create_direct_message_channel", {
      workspace_uid: arg.workspace_uid,
      user_id: arg.user_id,
    });
};
