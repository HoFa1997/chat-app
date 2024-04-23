import { useStore } from "@stores/index";
import { groupedMessages } from "@utils/index";

const getChannelMessages = (channelId: string): any => {
  const messagesByChannel = useStore.getState().messagesByChannel;
  return messagesByChannel.get(channelId);
};

export const messageInsert = (payload: any) => {
  const { channelId } = useStore.getState().workspaceSettings;
  const setOrUpdateMessage = useStore.getState().setOrUpdateMessage;
  const setLastMessage = useStore.getState().setLastMessage;
  const usersPresence = useStore.getState().usersPresence;
  const setOrUpdateThreadMessage = useStore.getState().setOrUpdateThreadMessage;

  if (!channelId) return;

  const messages = getChannelMessages(channelId || "");
  const userdata = usersPresence.get(payload.new.user_id);
  const reply_to_message_id = messages?.get(payload.new.reply_to_message_id);
  // TODO: reply message user id

  if (payload.new.deleted_at) return;

  const newMessage = {
    ...payload.new,
    user_details: userdata,
    replied_message_details: reply_to_message_id && {
      message: reply_to_message_id,
      user: reply_to_message_id?.user_details,
    },
  };

  console.log({
    newMessage,
  });

  // if there is no messages, just add the message
  if (!messages) {
    setLastMessage(channelId, newMessage);
    return setOrUpdateMessage(channelId, payload.new.id, newMessage);
  }

  const msgs = [...getChannelMessages(channelId)?.values()];

  // get last message and check if the last message is from the same user
  const lastMessage0 = msgs.pop();
  const lastMessage1 = msgs.pop();

  // if the last message is from the same user, we need to group the messages
  const newInstanceOfMessages = groupedMessages([
    lastMessage1,
    lastMessage0,
    newMessage,
  ]);

  if (newMessage.thread_id) {
    setOrUpdateThreadMessage(
      newMessage.thread_id,
      lastMessage0.id,
      newInstanceOfMessages.at(1),
    );
    setOrUpdateThreadMessage(
      newMessage.thread_id,
      newMessage.id,
      newInstanceOfMessages.at(2),
    );
    return;
  }

  // TODO: do we need anymore this?!/!
  setLastMessage(channelId, newInstanceOfMessages.at(-1));

  setOrUpdateMessage(channelId, lastMessage0.id, newInstanceOfMessages.at(1));
  setOrUpdateMessage(channelId, newMessage.id, newInstanceOfMessages.at(2));
};
