import { useState, useRef, useEffect } from "react";
import { useStore } from "@stores/index";

const SCROLL_TIMEOUT_DELAY = 100;

// If the type of messages is different, adjust the Map type accordingly.
export const useScrollAndLoad = (initialMessagesLoaded: boolean, messageContainerRef: any, msgLength: number) => {
  const [loading, setLoading] = useState<boolean>(msgLength === 0 ? false : true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { channelId } = useStore((state) => state.workspaceSettings);
  const messagesByChannel = useStore((state: any) => state.messagesByChannel);
  const messages = messagesByChannel.get(channelId);

  const scrollToBottom = (options: ScrollIntoViewOptions = {}) => {
    messagesEndRef.current?.scrollIntoView(options);
  };

  const checkIfScrolledToBottom = () => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;

      if (scrollHeight - scrollTop - 2 <= clientHeight) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Check if the user is close to the bottom of the message list.
    const isUserCloseToBottom = () => {
      if (!messageContainerRef.current) return false;

      const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;

      // Consider the user close to the bottom if they are within 100px of the bottom.
      return distanceToBottom < 200;
    };

    // Decide whether to scroll to the bottom based on loading state and user's position.
    const handleScrollToBottom = () => {
      if (loading) {
        // If still loading, just scroll to bottom without smooth behavior.
        scrollToBottom();
      } else if (isUserCloseToBottom()) {
        // If not loading and user is close to the bottom, scroll smoothly.
        scrollToBottom({ behavior: "smooth" });
      }
    };

    // Use a timer to defer scrolling until the new messages are rendered.
    const timer = setTimeout(handleScrollToBottom, 100);
    // console.log("scroll to bottom", { initialMessagesLoaded, loading });

    return () => clearTimeout(timer);
  }, [messages, initialMessagesLoaded, loading, channelId]);

  useEffect(() => {
    const checkScrollPosition = async () => {
      const container = messageContainerRef.current;
      if (!container) return;

      setLoading(true);

      const { scrollTop, scrollHeight, clientHeight } = container;

      container.addEventListener("scroll", checkIfScrolledToBottom);

      if (scrollTop === 0 && scrollHeight === clientHeight) {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(checkScrollPosition, SCROLL_TIMEOUT_DELAY);

    return () => {
      const container = messageContainerRef.current;
      if (container) {
        container.removeEventListener("scroll", checkIfScrolledToBottom);
      }
      clearTimeout(timeoutId);
    };
  }, [messageContainerRef?.current?.children, initialMessagesLoaded]);

  return { loading, messageContainerRef, messagesEndRef };
};
