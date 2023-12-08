import { useEffect } from "react";
import { supabaseClient } from "@/api/supabase";

export const useChannelMemberSubscription = (
  channelId: any,
  channelMembers: any,
  setChannelMembers: any,
  user: any,
  setIsChannelMember: any,
) => {
  useEffect(() => {
    const channelMemberSubscription = supabaseClient
      .channel(`channel_member_subscription`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "channel_members", filter: `channel_id=eq.${channelId}` },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            console.log("INSERT channel_member_subscription", { payload });

            if (payload.new) {
              const newChannelMembers = new Map(channelMembers);
              let userdata = null;
              if (channelMembers.has(payload.new.member_id)) {
                const user = channelMembers.get(payload.new.member_id);
                userdata = { username: user.username, id: user.id, avatar_url: user.avatar_url };
              }
              newChannelMembers.set(payload.new.member_id, { ...payload.new, ...userdata });
              setChannelMembers(newChannelMembers);

              if (newChannelMembers.has(user.id)) {
                setIsChannelMember(true);
              } else {
                setIsChannelMember(false);
              }
            }
          }
          if (payload.eventType === "UPDATE") {
            console.log("UPDATE channel_member_subscription", { payload });
            const getChannelMembers = channelMembers.get(payload.new.member_id);
            const newChannelMembers = new Map(channelMembers);
            newChannelMembers.set(payload.new.member_id, { ...getChannelMembers, ...payload.new });
            setChannelMembers(newChannelMembers);
          }
          if (payload.eventType === "DELETE") {
            console.log("DELETE channel_member_subscription", { payload });
            const newChannelMembers = new Map(channelMembers);
            newChannelMembers.delete(payload.old.member_id);
            setChannelMembers(newChannelMembers);
          }
        },
      )
      .subscribe();

    return () => {
      channelMemberSubscription.unsubscribe();
    };
  }, [channelId, channelMembers, user]);
};
