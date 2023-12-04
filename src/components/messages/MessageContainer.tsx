"use client";

import { useEffect, useState, useRef } from "react";
import { Box, CircularProgress, Chip } from "@mui/material";
import { supabaseClient } from "@/api/supabase";
import MessageCard from "./MessageCard";
import SendMessage from "./send-message/SendMessage";
import { getAllChannels, getAllMessages, getUser } from "@/api";
import MessageCard from "./MessageCard";
import { cookies } from "next/headers";
import SendMessage from "./send-message/SendMessage";
import { Box, CircularProgress, Chip, Typography } from "@mui/material";
import { MessageHeader } from "./MessageHeader";

export default function MessageContainer({ channelId }: any) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState(new Map());
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channelMember, setChannelMember] = useState(new Map());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: user } = await supabaseClient.auth.getSession();
        setUser(user.session.user);

        const { data, error } = await supabaseClient
          .from("channel_members")
          .select("*, member_id(username , id , avatar_url)")
          .eq("channel_id", channelId);

        if (data) {
          const newChannelMember = new Map();
          data.forEach((x) => newChannelMember.set(x.member_id.id, x.member_id));
          setChannelMember(newChannelMember);
        }
      } catch (error) {
        setError(error);
      } finally {
        // setLoading(false);
      }
    }

    fetchData();
  }, [channelId]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the last 10 messages
        const { data: initialMessages } = await supabaseClient
          .from("messages")
          .select("*, user_id( username , id , avatar_url ), reply_to_message_id( user_id( username ))")
          .eq("channel_id", channelId)
          .is("deleted_at", null)
          .order("created_at", { ascending: true }); // Replace 'created_at' with your timestamp field
        // .limit(10);
        console.log({ initialMessages });

        if (initialMessages) {
          const newMessages = new Map();
          initialMessages.forEach((message) => {
            newMessages.set(message.id, message);
          });
          setMessages(newMessages);
        }

        // setMessages(initialMessages); // Reverse to display in correct order
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [channelId]);

  useEffect(() => {
    // Subscribe to new messages
    const channels = supabaseClient.getChannels();

    console.log("subscrible", { channelId, channels });

    const subscription = supabaseClient
      .channel(`postgres_changes`) // Listen for new messages in the specified channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `channel_id=eq.${channelId}` },
        (payload: any) => {
          console.log("subscrible", {
            payload,
          });

          if (payload.eventType === "INSERT") {
            const userdata = channelMember.get(payload.new.user_id);
            const reply_to_message_id = messages.get(payload.new.reply_to_message_id);
            // TODO: reply message user id
            console.log({
              userdata,
              channelMember,
              userId: payload.new.user_id,
              reply_to_message_id: reply_to_message_id.user_id,
            });
            if (payload.new.deleted_at) return;

            setMessages((prevMessages) => {
              const newMessages = new Map(prevMessages);
              newMessages.set(payload.new.id, {
                ...payload.new,
                user_id: userdata,
                reply_to_message_id: reply_to_message_id && { user_id: reply_to_message_id?.user_id },
              });
              return newMessages;
            });
          }
          if (payload.eventType === "UPDATE") {
            const userdata = channelMember.get(payload.new.user_id);
            const reply_to_message_id = messages.get(payload.new.reply_to_message_id);
            console.log({ reply_to_message_id, messages });
            // get the message
            const message = messages.get(payload.new.id);
            // update the message
            const updatedMessage = { ...message, ...payload.new };
            // update the messages map

            if (payload.new.deleted_at) {
              setMessages((prevMessages) => {
                const newMessages = new Map(prevMessages);
                newMessages.delete(payload.new.id);
                return newMessages;
              });
            } else {
              setMessages((prevMessages) => {
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
      .subscribe((status) => {
        console.log("subscrible", {
          status,
        });
      });

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, [channelId, channelMember]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, [messages]);

  const scrollToBottom = () => {
    console.log("scroll to the bottom", messagesEndRef);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Box>Error loading messages...</Box>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        backgroundImage: "url(/bg-chat.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <MessageHeader channelId={channelId} />
      {messages?.length === 0 && (
        <Box display="flex" alignItems="center" height="100vh" justifyContent="center" flexGrow={1}>
          <Chip label={<Typography variant="body2">No messages yet!</Typography>} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", overflowY: "auto", scrollbarWidth: "none" }}>
          {[...messages.values()].map((item, index, array) => (
            <MessageCard
              key={item.id}
              data={item}
              user={user}
              ref={index === array.length - 1 ? messagesEndRef : null}
            />
          ))}
        </Box>
      )}
      <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", overflowY: "auto", px: 10 }}>
        {messages?.map((item) => <MessageCard key={item.id} data={item} user={user} />)}
      </Box>
      <SendMessage channelId={channelId} user={user} channels={channels} />
    </Box>
  );
}
