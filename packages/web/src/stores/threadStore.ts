import { immer } from "zustand/middleware/immer";
import { Database } from "@/types/supabase";

export type TMessage = Database["public"]["Tables"]["messages"]["Row"];

// Define the state interface
export interface ThreadState {
  startThreadMessage: TMessage | null;
  threadMessages: Map<string, Map<string, TMessage>>;

  setStartThreadMessage: (message: TMessage) => void;
  setThreadMessages: (threadId: string, messages: TMessage[]) => void;
  setOrUpdateThreadMessage: (
    threadId: string,
    messageId: string,
    message: TMessage | any,
  ) => void;
  removeThreadMessage: (threadId: string, messageId: string) => void;
  clearThreadMessages: () => void;
  clearThread: () => void;
}

// Implement the store with immer and support for channelId
const threadStore = immer<ThreadState>((set) => ({
  startThreadMessage: null,
  threadMessages: new Map(),

  setStartThreadMessage: (message: TMessage) =>
    set((state) => {
      // @ts-ignore
      state.startThreadMessage = message;
    }),

  setThreadMessages: (threadId: string, messages: TMessage[]) =>
    set((state) => {
      state.threadMessages.set(
        threadId,
        new Map(messages.map((message) => [message.id, message])),
      );
    }),

  setOrUpdateThreadMessage: (
    threadId: string,
    messageId: string,
    message: TMessage,
  ) =>
    set((state) => {
      if (!state.threadMessages.has(threadId)) {
        state.threadMessages.set(threadId, new Map());
      }
      state.threadMessages.get(threadId)?.set(messageId, message);
    }),

  removeThreadMessage: (threadId: string, messageId: string) =>
    set((state) => {
      if (state.threadMessages.has(threadId)) {
        state.threadMessages.get(threadId)?.delete(messageId);
      }
    }),

  clearThreadMessages: () =>
    set((state) => {
      state.threadMessages = new Map();
    }),

  clearThread: () =>
    set((state) => {
      state.startThreadMessage = null;
      state.threadMessages = new Map();
    }),
}));

export default threadStore;
