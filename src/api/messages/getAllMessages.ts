import { Database } from "@/types/supabase";
import { supabaseClient } from "../supabase";

export type TMessage = Database["public"]["Tables"]["messages"]["Row"];

export const getAllMessages = async (channelId: string) =>
  await supabaseClient
    .from("messages")
    .select("*, user_id(username,id,avatar_url)")
    .eq("channel_id", channelId)
    .order("inserted_at", { ascending: true })
    .returns<TMessageWithUser[]>()
    .throwOnError();

export type TMessageWithUser = {
  id: string;
  inserted_at: string;
  updated_at: string;
  deleted_at?: any;
  edited_at?: any;
  content: string;
  media_urls?: any;
  user_id: {
    username: string;
    id: string;
    avatar_url: string;
  };
  channel_id: string;
  reactions?: any;
  type?: any;
  metadata?: any;
  reply_to_message_id?: any;
  replied_message_preview?: any;
  original_message_id?: any;
};
