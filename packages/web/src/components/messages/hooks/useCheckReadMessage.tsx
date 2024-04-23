import { useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";
import { markReadMessages } from "@/api/rpc";
import { useStore } from "@stores/index";

export const useCheckReadMessage = ({ messageContainerRef, channelId, messages }: any) => {
  const [visibleCount, setVisibleCount] = useState<string[]>([]);
  const dCheckVisibility = useRef<any>(null);
  const setWorkspaceSetting = useStore((state: any) => state.setWorkspaceSetting);

  const checkVisibility = () => {
    const container = messageContainerRef.current;
    // console.log("checkVisibility function", container);
    if (!container) return;

    const visibleMessageIndexes: any = [];
    const containerStyles = window.getComputedStyle(container);
    const paddingTop = parseInt(containerStyles.paddingTop, 10);
    const paddingBottom = parseInt(containerStyles.paddingBottom, 10);

    const messageElements: HTMLElement[] = Array.from(container.querySelectorAll(".chat.msg_card"));
    // if the last message has readedAt, then all the messages are readed, so no need to check
    // @ts-ignore
    // console.log({
    //   container,
    //   messageElements,
    // });
    console.log({
      messageElements,
    });
    if (messageElements.at(-1)?.readedAt) return;

    messageElements.forEach((child, index) => {
      const childMarginTop = parseInt(window.getComputedStyle(child).marginTop, 10);
      const childMarginBottom = parseInt(window.getComputedStyle(child).marginBottom, 10);

      const childTop = child.offsetTop - paddingTop - childMarginTop;
      const childBottom = childTop + child.offsetHeight + childMarginBottom;
      const viewportTop = container.scrollTop;
      const viewportBottom = viewportTop + container.clientHeight - paddingBottom;

      if (childBottom > viewportTop && childTop < viewportBottom) {
        //@ts-ignore
        if (!child.readedAt) {
          //@ts-ignore
          visibleMessageIndexes.push({ id: child.msgId, createAt: child.createdAt });
        }
      }
    });

    setVisibleCount(visibleMessageIndexes);
  };

  useEffect(() => {
    // run for the first time
    checkVisibility();
  }, []);

  useEffect(() => {
    const current = messageContainerRef.current;

    if (!current) return;

    const { scrollTop, scrollHeight, clientHeight } = current;

    // Calculate the distance to the bottom of the scroll
    // Include a small threshold (e.g., 5px) to account for fractional pixels in calculations
    const isScrolledToBottom = scrollHeight - scrollTop - clientHeight <= 100;

    // console.log("new message call", { scrollTop, isScrollable, isScrolledToBottom });
    if (isScrolledToBottom) {
      checkVisibility(); // Call checkVisibility immediately
    }
  }, [messages, messageContainerRef.current]);

  useEffect(() => {
    const current = messageContainerRef.current;
    if (!current) return;

    dCheckVisibility.current = debounce(checkVisibility, 1000);
    current.addEventListener("scroll", dCheckVisibility.current, {
      passive: true,
    });
    return () => {
      current.removeEventListener("scroll", dCheckVisibility.current);
      dCheckVisibility.current.cancel();
    };
  }, [messageContainerRef.current]);

  useEffect(() => {
    // console.log({
    //   visibleCount,
    // });
    const lastMessage = visibleCount.at(-1);
    const lastReadMessageTimestamp = useStore.getState().workspaceSettings.lastReadMessageTimestamp;
    // check the creation of the last message
    if (!lastMessage) return;
    // console.log({
    //   visibleCount,
    //   channelId,
    //   lastMessage,
    //   lastReadMessageTimestamp,
    //   createAt: lastMessage.createAt,
    //   d: new Date(lastReadMessageTimestamp) < new Date(lastMessage.createAt),
    // });
    // check if the lastReadMessageTimestamp is greater than the last message creation time
    // if (new Date(lastReadMessageTimestamp) < new Date(lastMessage.createAt)) return;
    const lastReadTimestamp = new Date(lastReadMessageTimestamp).getTime();
    const lastVisibleTimestamp = new Date(lastMessage.createAt).getTime();

    // check if the last read message is greater than the last visible message
    if (lastReadTimestamp >= lastVisibleTimestamp) return;
    console.log({
      lastReadTimestamp,
      lastVisibleTimestamp,
      r: lastReadTimestamp - lastVisibleTimestamp,
      d: lastReadTimestamp <= lastVisibleTimestamp,
      lastMessage,
    });

    setWorkspaceSetting("lastReadMessageTimestamp", lastMessage.createAt);
    markReadMessages({ channelId, lastMessage: lastMessage.id }).then();
  }, [visibleCount]);
};