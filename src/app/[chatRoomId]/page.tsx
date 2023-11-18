import MessageContainer from "@/components/messages/MessageContainer";

export default function ChatRoomContainer({ params }: { params: { chatRoomId: string } }) {
  return <MessageContainer channelId={params.chatRoomId} />;
}
