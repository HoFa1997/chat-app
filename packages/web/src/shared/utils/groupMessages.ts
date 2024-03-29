import { isSameDay, parseISO } from "date-fns";

// Assuming a type for your messages, you can replace `any` with a more specific type
interface Message {
  created_at: string; // ISO date string
  user_id: string;
  // Add other relevant properties of the message here
}

const isDifferentDay = (date1: string, date2: string) => {
  return !isSameDay(parseISO(date1), parseISO(date2));
};

export const groupedMessages = (messages: Message[]) =>
  messages.map((message, index, array) => {
    // Using `at()` to access previous and next messages
    const prevMessage = array.at(index - 1);
    const nextMessage = array.at(index + 1);

    const isGroupStart =
      index === 0 ||
      message?.user_id !== prevMessage?.user_id ||
      isDifferentDay(message.created_at, prevMessage?.created_at);

    const isGroupEnd =
      index === array.length - 1 ||
      message?.user_id !== nextMessage?.user_id ||
      isDifferentDay(message.created_at, nextMessage?.created_at);

    const isNewGroupById = message?.user_id !== prevMessage?.user_id;

    return {
      ...message,
      isGroupStart,
      isGroupEnd,
      isNewGroupById,
    };
  });
