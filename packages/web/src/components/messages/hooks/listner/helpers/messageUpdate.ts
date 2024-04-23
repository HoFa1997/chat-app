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
  const setLastMessage = useStore.getState().setLastMessage;
  const lastMessages = useStore.getState().lastMessages.get(channelId);
  const setOrUpdateThreadMessage = useStore.getState().setOrUpdateThreadMessage;
  const removeThreadMessage = useStore.getState().removeThreadMessage;

  const reply_to_message_id = messages.get(payload.new.reply_to_message_id);
  // get the message
  const message = messages.get(payload.new.id);
  // update the message
  const updatedMessage = { ...message, ...payload.new };

  console.log("updatedmessage", {
    updatedMessage,
  });

  // update the messages map
  if (payload.new.deleted_at) {
    if (updatedMessage.thread_id) {
      removeThreadMessage(updatedMessage.thread_id, payload.new.id);
    } else {
      removeMessage(channelId, payload.new.id);
      if (lastMessages.id === payload.new.id) {
        setLastMessage(channelId, null);
      }
    }

    // TODO: if the message is pinned, we need to remove it from the pinned messages

    // TODO: if the message is the last message in a group (which have avatar), we need that group of messages
  } else {
    const newMessage = {
      ...updatedMessage,
      user_details: userdata,
      replied_message_details: reply_to_message_id && {
        message: reply_to_message_id,
        user: reply_to_message_id?.user_details,
      },
    };

    if (newMessage.thread_id) {
      setOrUpdateThreadMessage(
        updatedMessage.thread_id,
        payload.new.id,
        newMessage,
      );
      return;
    }

    setOrUpdateMessage(channelId, payload.new.id, newMessage);
  }
};
