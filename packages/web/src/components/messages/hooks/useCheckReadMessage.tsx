import { useEffect, useState, useRef } from "react";
import { debounce } from "@/shared/utils/debounce";
import { markReadMessages } from "@/api/rpc";

export const useCheckReadMessage = ({ messageContainerRef, channelId, messages }: any) => {
  const [visibleCount, setVisibleCount] = useState<string[]>([]);
  const dCheckVisibility = useRef<any>(null);

  const checkVisibility = () => {
    const container = messageContainerRef.current;
    if (!container) return;

    const visibleMessageIndexes: string[] = [];
    const containerStyles = window.getComputedStyle(container);
    const paddingTop = parseInt(containerStyles.paddingTop, 10);
    const paddingBottom = parseInt(containerStyles.paddingBottom, 10);

    const messageElements: HTMLElement[] = Array.from(container.querySelectorAll(".chat.msg_card"));
    // if the last message has readedAt, then all the messages are readed, so no need to check
    // @ts-ignore
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
          visibleMessageIndexes.push(child.msgId);
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
    current.addEventListener("scroll", dCheckVisibility.current.debouncedFunction, {
      passive: true,
    });
    return () => {
      current.removeEventListener("scroll", dCheckVisibility.current.debouncedFunction);
      dCheckVisibility.current.cancel();
    };
  }, [messageContainerRef.current]);

  useEffect(() => {
    const lastMessage = visibleCount.at(-1);
    if (!lastMessage) return;

    markReadMessages({ channelId, lastMessage }).then();
  }, [visibleCount]);
};
