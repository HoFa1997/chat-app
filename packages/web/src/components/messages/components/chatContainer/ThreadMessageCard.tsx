import React from "react";
import { TMessageWithUser } from "@/api";
import { useUserProfileModalStore } from "../UserProfileModal";
import { Avatar } from "@/components/ui/Avatar";
import ThreadMessageFooter from "./ThreadMessageFooter";
import MessageHeader from "./MessageHeader";
import MessageContent from "./MessageContent";
import { isOnlyEmoji } from "@/shared";

type TThreadMessageCardProps = {
  data: TMessageWithUser;
};

function ThreadMessageCard({ data }: TThreadMessageCardProps) {
  const openModal = useUserProfileModalStore((state) => state.openModal);
  const modalOpen = useUserProfileModalStore((state) => state.modalOpen);
  const closeModal = useUserProfileModalStore((state) => state.closeModal);

  const handleAvatarClick = () => {
    // Assuming data contains user information
    if (modalOpen) closeModal();
    else {
      openModal("userProfileModal", data.user_details);
    }
  };

  return (
    <div className="msg_card group chat chat-start relative w-full">
      <Avatar
        src={data?.user_details?.avatar_url}
        className="avatar chat-image w-10 cursor-pointer rounded-full transition-all hover:scale-105"
        style={{
          width: 40,
          height: 40,
          cursour: "pointer",
        }}
        id={data?.user_details?.id}
        alt={`avatar_${data?.user_details?.id}`}
        onClick={handleAvatarClick}
      />

      {isOnlyEmoji(data?.content) ? (
        <div className="w-full">
          <MessageHeader data={{ ...data, isGroupStart: true }} />
          <MessageContent data={data} />
          <ThreadMessageFooter data={data} />
        </div>
      ) : (
        <div className={`chat-bubble flex w-full flex-col`}>
          <MessageHeader data={{ ...data, isGroupStart: true }} />
          <MessageContent data={data} />
          <ThreadMessageFooter data={data} />
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(ThreadMessageCard);
