import { useStore } from "@stores/index";

const getChannelMessages = (channelId: string): any => {
  const messagesByChannel = useStore.getState().messagesByChannel;
  return messagesByChannel.get(channelId);
};

export const messageUpdate = (payload: any) => {
  const { channelId } = useStore.getState().workspaceSettings;
  if (!channelId) return;

  const messages = getChannelMessages(channelId);
  const setOrUpdateMessage = useStore.getState().setOrUpdateMessage;
  const removeMessage = useStore.getState().removeMessage;
  const usersPresence = useStore.getState().usersPresence;
  const userdata = usersPresence.get(payload.new.user_id);

  const reply_to_message_id = messages.get(payload.new.reply_to_message_id);
  // get the message
  const message = messages.get(payload.new.id);
  // update the message
  const updatedMessage = { ...message, ...payload.new };
  // update the messages map
  if (payload.new.deleted_at) {
    removeMessage(channelId, payload.new.id);
  } else {
    const newMessage = {
      ...updatedMessage,
      user_details: userdata,
      user_id: userdata,
      replied_message_details: reply_to_message_id && {
        message: reply_to_message_id,
        user: reply_to_message_id?.user_details,
      },
    };

    setOrUpdateMessage(channelId, payload.new.id, newMessage);
  }
};
