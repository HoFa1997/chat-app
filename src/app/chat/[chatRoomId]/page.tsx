import { MessageContainer } from "@/components";

export default function ChatRoomContainer({
  params,
}: {
  params: { chatRoomId: string };
}) {
  return <MessageContainer chatRoomId={params.chatRoomId} />;
}
