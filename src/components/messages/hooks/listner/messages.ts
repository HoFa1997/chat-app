export default function messageListner(payload: any, { messages, setMessages, channelMembers }: any) {
  if (payload.eventType === "INSERT") {
    const userdata = channelMembers.get(payload.new.user_id);
    const reply_to_message_id = messages.get(payload.new.reply_to_message_id);
    // TODO: reply message user id

    if (payload.new.deleted_at) return;

    const newMessage = {
      ...payload.new,
      user_id: userdata,
      reply_to_message_id: reply_to_message_id && { user_id: reply_to_message_id?.user_id },
    };

    setMessages((prevMessages: any) => new Map(prevMessages).set(newMessage.id, newMessage));
  }
  if (payload.eventType === "UPDATE") {
    const userdata = channelMembers.get(payload.new.user_id);
    const reply_to_message_id = messages.get(payload.new.reply_to_message_id);
    // get the message
    const message = messages.get(payload.new.id);
    // update the message
    const updatedMessage = { ...message, ...payload.new };
    // update the messages map
    if (payload.new.deleted_at) {
      setMessages((prevMessages: any) => {
        const newMessages = new Map(prevMessages);
        newMessages.delete(payload.new.id);
        return newMessages;
      });
    } else {
      setMessages((prevMessages: any) => {
        const newMessages = new Map(prevMessages);
        newMessages.set(payload.new.id, {
          ...updatedMessage,
          user_id: userdata,
          reply_to_message_id: reply_to_message_id && { user_id: reply_to_message_id?.user_id },
        });
        return newMessages;
      });
    }
  }
}
