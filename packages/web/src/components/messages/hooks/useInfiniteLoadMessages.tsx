import { useState, useEffect, MutableRefObject } from "react";
import { groupedMessages } from "@utils/index";
import { useStore } from "@stores/index";
import { fetchMessagesPaginated } from "@/api";
import { useFirstMsgCardObserver } from "./";

const PAGE_SIZE = 20;
const START_PAGE = 2;

const adjustScrollPositionAfterLoadingMessages = (
  messageContainerRef: MutableRefObject<HTMLElement | null>,
  markedElement: HTMLElement | null,
) => {
  if (!messageContainerRef.current || !markedElement) return;

  const newOffsetTop = markedElement.offsetTop;
  messageContainerRef.current.scrollTop += newOffsetTop;
};

export const useInfiniteLoadMessages = (
  messageContainerRef: MutableRefObject<HTMLElement | null>,
) => {
  const [currentPage, setCurrentPage] = useState<number>(START_PAGE);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const { channelId } = useStore((state: any) => state.workspaceSettings);

  const replaceMessages = useStore((state: any) => state.replaceMessages);
  const messagesByChannel = useStore((state: any) => state.messagesByChannel);
  const messages = messagesByChannel.get(channelId);

  const loadMoreMessages = async () => {
    const msgContainer = messageContainerRef.current;
    if (!hasMoreMessages || !msgContainer) return;
    setIsLoadingMore(true);

    const currentTopElement = messageContainerRef.current?.firstChild;

    const pageMessages = await fetchMessagesPaginated({
      input_channel_id: channelId,
      page: currentPage,
      page_size: PAGE_SIZE,
    });

    // If there are no messages, stop loading more
    if (!pageMessages?.messages || pageMessages?.messages?.length == 0) {
      setIsLoadingMore(false);
      return;
    }

    if (pageMessages?.messages && pageMessages?.messages?.length > 0) {
      // Convert pageMessages.messages to a Map
      const newMessagesMap: any = new Map(
        groupedMessages(pageMessages.messages.reverse()).map((message: any) => [
          message.id,
          message,
        ]),
      );

      // Merge the new messages with the existing ones
      const updatedMessages: Map<string, any> = new Map([...newMessagesMap, ...messages]);

      replaceMessages(channelId, updatedMessages);
      setCurrentPage(currentPage + 1);

      adjustScrollPositionAfterLoadingMessages(messageContainerRef, currentTopElement);
      setIsLoadingMore(false);
    } else {
      setHasMoreMessages(false);
    }
  };

  const isVisible = useFirstMsgCardObserver(messageContainerRef, {
    root: messageContainerRef.current,
    rootMargin: "60px",
    threshold: 1.0,
  });

  useEffect(() => {
    if (!messageContainerRef) return;
    if (isVisible) loadMoreMessages();
  }, [isVisible, messageContainerRef]);

  return { isLoadingMore };
};
