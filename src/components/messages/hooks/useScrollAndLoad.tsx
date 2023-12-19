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
    const timer = setTimeout(() => {
      loading ? scrollToBottom() : scrollToBottom({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages, initialMessagesLoaded]);

  useEffect(() => {
    if (!initialMessagesLoaded) return;

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
