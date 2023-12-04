import { supabaseClient } from "../supabase";

export const pinMessage = async (channelId: string, messageId: string) => {
  const {
    data: { session: user },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    throw error;
  }

  if (!user) throw new Error("User not found");

  return await supabaseClient
    .from("pinned_messages")
    .insert({
      channel_id: channelId,
      pinned_by: user?.user.id,
      message_id: messageId,
      pinned_at: new Date().toISOString(),
    })
    .select()
    .throwOnError();
};
