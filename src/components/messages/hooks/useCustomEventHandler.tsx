import { useEffect, MutableRefObject, Dispatch, SetStateAction } from "react";

export const useCustomEventHandler = (
  channelUsersPresence: Map<string, any>,
  setChannelUsersPresence: Dispatch<SetStateAction<Map<string, any>>>,
  messageContainerRef: MutableRefObject<HTMLElement | null>,
  messagesEndRef: MutableRefObject<HTMLElement | null>,
  messages: Map<string, any>,
) => {
  useEffect(() => {
    // listen to custom event update:channel:usersPresence
    const handleUpdateChannelUsersPresence = (e: any) => {
      const { newUser } = e.detail;
      // check if the user is already in the channelUsersPresence
      if (channelUsersPresence.has(newUser.id)) return;
      setChannelUsersPresence((prevChannelUsersPresence) => new Map(prevChannelUsersPresence).set(newUser.id, newUser));
    };
    document.addEventListener("update:channel:usersPresence", handleUpdateChannelUsersPresence);
    return () => {
      document.removeEventListener("update:channel:usersPresence", handleUpdateChannelUsersPresence);
    };
  }, [channelUsersPresence]);

  useEffect(() => {
    const handleScrollDown = () => {
      setTimeout(() => {
        const container = messagesEndRef.current;
        container?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    };

    if (messagesEndRef.current) {
      document.addEventListener("messages:container:scroll:down", handleScrollDown);
    }

    return () => {
      if (messagesEndRef.current) {
        document.removeEventListener("messages:container:scroll:down", handleScrollDown);
      }
    };
  }, [messageContainerRef, messages]);
};
