import React, { forwardRef, useMemo } from "react";
import { deleteMessage, pinMessage } from "@/api";
import { setReplayMessage, setEditeMessage } from "@/shared/hooks";
import { BsReplyFill, BsForwardFill, BsFillPinFill, BsFillTrashFill, BsFillPinAngleFill } from "react-icons/bs";
import { RiPencilFill } from "react-icons/ri";
import { useForwardMessageModalStore } from "@/components/messages/components/ForwardMessageModal";
import toast from "react-hot-toast";
import { ContextMenu, MenuItem } from "@ui/ContextMenu";
import { useStore } from "@stores/index";

export const MessageContextMenu = forwardRef<
  HTMLUListElement,
  { messageData: any; className: string; parrentRef: any }
>(({ messageData, className, parrentRef }, ref) => {
  const openModal = useForwardMessageModalStore((state: any) => state.openModal);
  const addChannelPinnedMessage = useStore((state) => state.addChannelPinnedMessage);
  const removeChannelPinnedMessage = useStore((state) => state.removeChannelPinnedMessage);
  const { channelId, workspaceBroadcaster } = useStore((state) => state.workspaceSettings);

  if (!channelId) return null;

  const handleReplayMessage = () => {
    if (messageData) {
      setReplayMessage(messageData);
      // call editor focus
      const event = new CustomEvent("editor:focus");
      document.dispatchEvent(event);
    }
  };

  const handelDeleteMessage = async () => {
    const { error } = await deleteMessage(messageData.channel_id, messageData.id);
    if (!error) {
      toast.success("Message deleted");
    } else {
      toast.error("Message not deleted");
    }
  };

  const handlePinMessage = async () => {
    const actionType = messageData.metadata?.pinned ? "unpin" : "pin";
    const { error } = await pinMessage(messageData.channel_id, messageData.id, actionType);
    if (!error) {
      toast.success("Message pinned successfully");
    } else {
      toast.error("Message not pinned");
    }

    if (!error && actionType === "pin") {
      addChannelPinnedMessage(messageData.channel_id, messageData);
    } else {
      removeChannelPinnedMessage(messageData.channel_id, messageData.id);
    }

    await workspaceBroadcaster.send({
      type: "broadcast",
      event: "pinnedMessage",
      payload: {
        message: messageData,
        actionType,
      },
    });
  };

  const handelEdite = () => {
    if (!messageData) return;
    setEditeMessage(messageData);
  };

  const isPinned = useMemo(() => {
    return messageData?.metadata?.pinned;
  }, [messageData]);

  const messageButtonList = [
    { title: "Replay", icon: <BsReplyFill size={20} />, onClickFn: handleReplayMessage },
    {
      title: "Forward",
      icon: <BsForwardFill size={20} />,
      onClickFn: () => openModal("forwardMessageModal", messageData),
    },
    {
      title: isPinned ? "Unpin" : "Pin",
      icon: isPinned ? <BsFillPinAngleFill size={20} /> : <BsFillPinFill size={20} />,
      onClickFn: () => handlePinMessage(),
    },
    { title: "Edit", icon: <RiPencilFill size={20} />, onClickFn: () => handelEdite() },
    { title: "Delete", icon: <BsFillTrashFill size={20} />, onClickFn: () => handelDeleteMessage() },
  ];

  return (
    <ContextMenu className={className} parrentRef={parrentRef} ref={ref}>
      {messageButtonList.map((item) => (
        <MenuItem key={item.title} onClick={item.onClickFn}>
          <a href="#" className="no-underline">
            {item.icon}
            {item.title}
          </a>
        </MenuItem>
      ))}
    </ContextMenu>
  );
});

MessageContextMenu.displayName = "MessageContextMenu";
