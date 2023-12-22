import { useEffect, useState } from "react";
import { supabaseClient } from "@/api/supabase";

export const useChannleInitialData = (channelId: any, setMessages: any, setError: any) => {
  const [userSession, setUserSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [isUserChannelMember, setIsUserChannelMember] = useState(false);
  const [channelMemberInfo, setChannelMemberInfo] = useState(null);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState(new Map());

  useEffect(() => {
    if (!channelId) return;
    const getChannleInitialData = async () => {
      try {
        const initialAggrigateData = supabaseClient
          .rpc("get_channel_aggregate_data", { input_channel_id: channelId })
          .single();
        const userSession = supabaseClient.auth.getSession();

        const [{ data: channelData, error: channelError }, { data: user, error: sessionError }] = await Promise.all([
          initialAggrigateData,
          userSession,
        ]);

        if (sessionError) throw new Error(sessionError?.message);
        if (channelError) throw new Error(channelError?.message);

        user?.session?.user && setUserSession(user?.session?.user);

        console.log({
          channelData,
        });

        if (channelData?.channel_member_info) {
          setChannelMemberInfo(channelData?.channel_member_info);
        } else {
          setChannelMemberInfo(null);
        }

        if (channelData.is_user_channel_member) {
          setIsUserChannelMember(channelData.is_user_channel_member);
        } else {
          setIsUserChannelMember(false);
        }

        if (channelData?.user_profile) {
          setUserProfile(channelData.user_profile);
        } else {
          setUserProfile(null);
        }

        if (channelData?.channel_info) {
          setChannelInfo(channelData.channel_info);
        } else {
          setChannelInfo(null);
        }

        if (channelData?.pinned_messages) {
          setPinnedMessages(
            new Map(channelData.pinned_messages.map((pinnedMessage: any) => [pinnedMessage.pinned_at, pinnedMessage])),
          );
        } else {
          setPinnedMessages(new Map());
        }

        if (channelData?.last_messages) {
          const messagesMap = new Map();
          channelData.last_messages.reverse()?.forEach((message: any) => messagesMap.set(message.id, message));
          setMessages(messagesMap);
        } else {
          setMessages(new Map());
        }
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setInitialMessagesLoaded(true);
      }
    };

    if (channelId) {
      setInitialMessagesLoaded(false);
      getChannleInitialData();
    }
  }, [channelId]);

  return {
    pinnedMessages,
    initialMessagesLoaded,
    userSession,
    userProfile,
    channelInfo,
    isUserChannelMember,
    channelMemberInfo,
  };
};
