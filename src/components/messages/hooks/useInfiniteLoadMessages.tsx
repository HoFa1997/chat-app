import { useState, useEffect, MutableRefObject, SetStateAction, Dispatch } from "react";
import { supabaseClient } from "@/api/supabase";

export const useInfiniteLoadMessages = (
  channelId: string,
  messageContainerRef: MutableRefObject<HTMLElement | null>,
  messages: Map<string, any>,
  setMessages: Dispatch<SetStateAction<Map<string, any>>>,
) => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState<number>(2);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const fetchMessages = async (channelId: string, pageNumber: number, pageSize: number) => {
    try {
      // eslint-disable-next-line
      let { data, error } = await supabaseClient
        .rpc("get_channel_messages_paginated", {
          input_channel_id: channelId,
          page: pageNumber,
          page_size: pageSize,
        })
        .single();

      if (error) throw error;

      return data as any;
    } catch (error: any) {
      console.error("Error fetching messages:", error.message);
      return null;
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMoreMessages || !messageContainerRef.current) return;
    setIsLoadingMore(true);

    // select first ".MessageCard" from messageContainerRef.current
    const firstVisibleMessage = messageContainerRef.current.querySelector(".msg_card") as HTMLElement;
    const prevTop = firstVisibleMessage ? firstVisibleMessage?.offsetTop : 0;

    const pageMessages = (await fetchMessages(channelId, currentPage, pageSize)) as any;

    if (pageMessages?.messages && pageMessages?.messages?.length > 0) {
      // Convert pageMessages.messages to a Map
      const newMessagesMap: any = new Map(pageMessages.messages.reverse().map((message: any) => [message.id, message]));

      // Merge the new messages with the existing ones
      const updatedMessages: Map<string, any> = new Map([...newMessagesMap, ...messages]);

      setMessages(updatedMessages);
      setCurrentPage(currentPage + 1);

      // Adjust the scroll position
      requestAnimationFrame(() => {
        if (messageContainerRef.current && firstVisibleMessage) {
          const date_chip = messageContainerRef.current.querySelector(".date_chip") as HTMLElement;
          const currentTop = firstVisibleMessage.offsetTop + date_chip.offsetHeight; //;
          messageContainerRef.current.scrollTop += currentTop - prevTop;
          setIsLoadingMore(false);
        }
      });
    } else {
      setHasMoreMessages(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const current = messageContainerRef.current;
      if (current) {
        const isAtTop = current.scrollTop == 0;
        if (isAtTop) loadMoreMessages();
      }
    };

    const currentRef = messageContainerRef.current;
    currentRef?.addEventListener("scroll", handleScroll);

    return () => {
      currentRef?.removeEventListener("scroll", handleScroll);
    };
  }, [messageContainerRef, messages]);

  return { isLoadingMore };
};
