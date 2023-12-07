import { useEffect } from "react";
import { supabaseClient } from "@/api/supabase";

export const useMessagesData = (channelId: any, setMessages: any, setError: any) => {
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: messages } = await supabaseClient
          .from("messages")
          .select("*, user_id( username, id, avatar_url ), reply_to_message_id( user_id( username ))")
          .eq("channel_id", channelId)
          .is("deleted_at", null)
          .order("created_at", { ascending: true });

        const messagesMap = new Map();
        messages?.forEach((message) => messagesMap.set(message.id, message));
        setMessages(messagesMap);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
      }
    };

    if (channelId) {
      fetchMessages();
    }
  }, [channelId]);
};
