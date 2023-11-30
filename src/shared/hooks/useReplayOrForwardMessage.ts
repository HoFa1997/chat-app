import { TMessageWithUser } from "@/api";
import { create } from "zustand";

type TUseReplayOrForwardMessage = {
  replayToMessage: TMessageWithUser | null;
  forwardMessage: TMessageWithUser | null;
};

const useReplayOrForwardMessage = create<TUseReplayOrForwardMessage>(() => ({
  replayToMessage: null,
  forwardMessage: null,
}));

export const useReplayMessageInfo = () => useReplayOrForwardMessage().replayToMessage;

export const useForwardMessageInfo = () => useReplayOrForwardMessage().forwardMessage;

export const setReplayMessage = (replayToMessageId: TUseReplayOrForwardMessage["replayToMessage"]) =>
  useReplayOrForwardMessage.setState({ replayToMessage: replayToMessageId, forwardMessage: null });

export const setForwardMessage = (forwardedMessage: TUseReplayOrForwardMessage["forwardMessage"]) =>
  useReplayOrForwardMessage.setState({ forwardMessage: forwardedMessage, replayToMessage: null });
