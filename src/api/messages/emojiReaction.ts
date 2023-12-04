import { supabaseClient } from "../supabase";

export const emojiReaction = async (message: any, newReaction: string) => {
  const {
    data: { session: user },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    throw error;
  }

  if (!user) throw new Error("User not found");

  const findReaction = message.reactions && message.reactions[newReaction];

  if (findReaction) {
    const findUser = findReaction.find((reaction: any) => reaction.user_id === user?.user.id);
    // if user already reacted, remove reaction
    if (findUser) {
      const index = findReaction.indexOf(findUser);
      findReaction.splice(index, 1);
      if (findReaction.length === 0) delete message.reactions[newReaction];
    } else {
      findReaction.push({ user_id: user?.user.id, created_at: new Date().toISOString() });
    }
  } else {
    if (!message.reactions) message.reactions = {};
    message.reactions[newReaction] = [{ user_id: user?.user.id, created_at: new Date().toISOString() }];
  }

  console.log({
    message,
  });

  return await supabaseClient
    .from("messages")
    .update({ reactions: message.reactions })
    .eq("channel_id", message.channel_id)
    .eq("id", message.id)
    .select()
    .throwOnError();
};
