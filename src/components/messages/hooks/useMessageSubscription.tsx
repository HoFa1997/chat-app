import { useEffect } from "react";
import { supabaseClient } from "@/api/supabase";

// there is not relation join in realtime subscription
// so we first get the online members and save it to the channel member state store
// and then we put the current user into that state store
// then if new message comes from the online user, we have those user data in the channel member state store
// and if a new user online or join the channel, we put it into the channel member state store

// with this approach we can have runtime join and we do not need to have join or view or other approach!
// I suppose this approch hase more performance than the other one!

// reply message!
// forward message!

// for forward messages we need first check if for the coming message we have the user data in state store.
// otherwise we need to fetch the user data from the database and then put it into the state store

// pinned message, I just put the contnet to the pinned message

export const useMessageSubscription = (
  channelId: string | string[] | undefined,
  setMessages: any,
  messages: any,
  channelUsersPresence: any,
  user: any,
  userProfile: any,
  setChannelUsersPresence: any,
  setIsSubscribe: any,
) => {
  useEffect(() => {
    if (!channelId) return;
    if (!user) return;
    const messageSubscription = supabaseClient
      .channel(`channel:${channelId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `channel_id=eq.${channelId}` },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const userdata = channelUsersPresence.get(payload.new.user_id);
            const reply_to_message_id = messages.get(payload.new.reply_to_message_id);
            // TODO: reply message user id

            if (payload.new.deleted_at) return;

            console.log({
              payload,
              userdata,
              reply_to_message_id,
              channelUsersPresence,
            });

            const newMessage = {
              ...payload.new,
              user_details: userdata,
              user_id: userdata,
              // reply_to_message_id: reply_to_message_id && { user_id: reply_to_message_id?.user_id },
              replied_message_details: reply_to_message_id && {
                message: reply_to_message_id,
                user: reply_to_message_id?.user_details,
              },
            };

            setMessages((prevMessages: any) => new Map(prevMessages).set(newMessage.id, newMessage));
          }
          if (payload.eventType === "UPDATE") {
            const userdata = channelUsersPresence.get(payload.new.user_id);
            const reply_to_message_id = messages.get(payload.new.reply_to_message_id);
            // get the message
            const message = messages.get(payload.new.id);
            // update the message
            const updatedMessage = { ...message, ...payload.new };
            // update the messages map
            if (payload.new.deleted_at) {
              setMessages((prevMessages: any) => {
                const newMessages = new Map(prevMessages);
                newMessages.delete(payload.new.id);
                return newMessages;
              });
            } else {
              setMessages((prevMessages: any) => {
                const newMessages = new Map(prevMessages);
                newMessages.set(payload.new.id, {
                  ...updatedMessage,
                  user_id: userdata,
                  reply_to_message_id: reply_to_message_id && { user_id: reply_to_message_id?.user_id },
                });
                return newMessages;
              });
            }
          }
        },
      )

      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        // broadcast user presence
        // await messageSubscription.track(userProfile);
      });

    return () => {
      messageSubscription.unsubscribe();
    };
  }, [channelId, userProfile, channelUsersPresence]);

  useEffect(() => {
    const messageSubscription = supabaseClient
      .channel(`channel_presence:${channelId}`)
      .on("presence", { event: "sync" }, () => {
        // const newState = messageSubscription.presenceState();
        // console.log("sync", newState);
        // newState.forEach((value: any, key: any) => {
        //   channelUsersPresence.set(key, value);
        // }
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // add the user into the channel member state store
        // if the user is not in the channel member state store
        // console.log("join", { key, newPresences });
        if (channelUsersPresence.has(newPresences.at(0).id)) return;
        setChannelUsersPresence((prevChannelUsersPresence: any) => {
          const newChannelUsersPresence = new Map(prevChannelUsersPresence);
          const newUser = {
            ...newPresences.at(0),
            status: "ONLINE",
          };
          newChannelUsersPresence.set(newPresences.at(0).id, newUser);
          return newChannelUsersPresence;
        });
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
        // update user status to offline in the channel member state store
        // if the user is in the channel member state store
        if (!channelUsersPresence.has(leftPresences.at(0).id)) return;
        setChannelUsersPresence((prevChannelUsersPresence: any) => {
          const newChannelUsersPresence = new Map(prevChannelUsersPresence);
          const newUser = {
            ...leftPresences.at(0),
            status: "OFFLINE",
          };
          newChannelUsersPresence.set(leftPresences.at(0).id, newUser);
          return newChannelUsersPresence;
        });
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        // broadcast user presence
        await messageSubscription.track(userProfile);
        setIsSubscribe(true);
      });

    // TODO: channle Events Gateway
    document.addEventListener("channel:events", (e) => {
      const eventType = e.detail.eventType;
      const eventPayload = e.detail.eventPayload;
    });

    return () => {
      messageSubscription.unsubscribe();
    };
    channelId;
  }, [channelId, userProfile]);
};
