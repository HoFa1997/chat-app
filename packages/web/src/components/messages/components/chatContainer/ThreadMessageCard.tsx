/* eslint-disable */
// @ts-nocheck

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TMessageWithUser } from "@/api";
import { useUserProfileModalStore } from "../UserProfileModal";
import { Avatar } from "@/components/ui/Avatar";
import ThreadMessageFooter from "./ThreadMessageFooter";
import MessageHeader from "./MessageHeader";
import MessageContent from "./MessageContent";
import { isOnlyEmoji } from "@/shared";

type TThreadMessageCardProps = {
  data: TMessageWithUser;
  toggleEmojiPicker?: any;
  selectedEmoji?: any;
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
    <div className={`group w-full chat-start chat msg_card relative`}>
      <Avatar
        src={data?.user_details?.avatar_url}
        className="w-10 rounded-full cursor-pointer hover:scale-105 transition-all chat-image avatar"
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
        <div className="max-w-[70%] min-w-full mb-4">
          <MessageHeader data={data} />
          <MessageContent data={data} />
          <ThreadMessageFooter data={data} />
        </div>
      ) : (
        <div className={`chat-bubble !mt-0 flex flex-col w-full `}>
          <MessageHeader data={data} />
          <MessageContent data={data} />
          <ThreadMessageFooter data={data} />
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(ThreadMessageCard);
