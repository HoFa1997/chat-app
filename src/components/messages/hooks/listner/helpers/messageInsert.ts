import { useStore } from "@stores/index";
import { groupedMessages } from "@utils/index";

const getChannelMessages = (channelId: string): any => {
  const messagesByChannel = useStore.getState().messagesByChannel;
  return messagesByChannel.get(channelId);
};

export const messageInsert = (payload: any) => {
  const { channelId } = useStore.getState().workspaceSettings;
  const setOrUpdateMessage = useStore.getState().setOrUpdateMessage;
  const usersPresence = useStore.getState().usersPresence;

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

  // if there is no messages, just add the message
  if (!messages) return setOrUpdateMessage(channelId, payload.new.id, newMessage);

  // get last message and check if the last message is from the same user
  const lastMessage = [...getChannelMessages(channelId)?.values()].pop();

  // if the last message is from the same user, we need to group the messages
  const newInstanceOfMessages = groupedMessages([lastMessage, newMessage]);

  setOrUpdateMessage(channelId, lastMessage.id, newInstanceOfMessages.at(0));
  setOrUpdateMessage(channelId, newMessage.id, newInstanceOfMessages.at(1));
};
