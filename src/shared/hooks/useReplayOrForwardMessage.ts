import { TMessageWithUser } from "@/api";
import { create } from "zustand";

type TUseReplayOrForwardMessage = {
  replayToMessage: TMessageWithUser | null;
  editeMessage: TMessageWithUser | null;
};

const useReplayOrForwardMessage = create<TUseReplayOrForwardMessage>(() => ({
  replayToMessage: null,
  editeMessage: null,
}));

export const useReplayMessageInfo = () => useReplayOrForwardMessage().replayToMessage;
export const useEditeMessageInfo = () => useReplayOrForwardMessage().editeMessage;

export const setReplayMessage = (replayToMessageId: TUseReplayOrForwardMessage["replayToMessage"]) =>
  useReplayOrForwardMessage.setState({ replayToMessage: replayToMessageId });

export const setEditeMessage = (editeMessage: TUseReplayOrForwardMessage["editeMessage"]) =>
  useReplayOrForwardMessage.setState({ editeMessage });
