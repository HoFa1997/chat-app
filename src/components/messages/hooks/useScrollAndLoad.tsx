import { useState, useRef, useEffect } from "react";

// Define a type for the messages parameter if it's not defined elsewhere.
// Assuming that the messages Map has a string key and a custom message type value.
type Message = {
  id: string;
  // other properties of a message
};

// If the type of messages is different, adjust the Map type accordingly.
export const useScrollAndLoad = (
  messages: Map<string, Message>,
  initialMessagesLoaded: boolean,
  channelId: string | string[] | undefined,
  isSubscribe: boolean,
) => {
  const [loading, setLoading] = useState<boolean>(true);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
      return distanceToBottom < 100;
    };

    // Decide whether to scroll to the bottom based on loading state and user's position.
    const handleScrollToBottom = () => {
      if (loading || !isSubscribe) {
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
    const container = messageContainerRef.current;
    if (container) {
      setLoading(true);

      const { scrollTop, scrollHeight, clientHeight } = container;
      container.addEventListener("scroll", checkIfScrolledToBottom);

      // it mean there is not message tha need to scroll to bottom
      if (scrollTop === 0 && scrollHeight === clientHeight) setLoading(false);
    } else {
      setLoading(false);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkIfScrolledToBottom);
      }
    };
  }, [messageContainerRef, initialMessagesLoaded]);

  return { loading, messageContainerRef, messagesEndRef };
};
