import MessageContainer from "@/components/messages/MessageContainer";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { UserProfileModal } from "@/components/messages/components/UserProfileModal";
import { useStore } from "@stores/index";
import { getChannels } from "@/api";
import { useApi } from "@/shared/hooks/useApi";
import MainLayout from "@/components/layouts/MainLayout";
import ForwardMessageModal from "@/components/messages/components/ForwardMessageModal";
import { setReplayMessage, setEditeMessage } from "@/shared/hooks";

export default function ChatRoomContainer() {
  const router = useRouter();
  const { workspaceId, channelId } = router.query;
  const setWorkspaceSetting = useStore((state) => state.setWorkspaceSetting);
  const clearAndInitialChannels = useStore((state) => state.clearAndInitialChannels);
  const { loading, data, request } = useApi(getChannels, workspaceId, false);

  useEffect(() => {
    if (!workspaceId) return;
    setWorkspaceSetting("workspaceId", workspaceId);
    request(workspaceId);
  }, [workspaceId]);

  useEffect(() => {
    if (data && !loading) {
      clearAndInitialChannels(data);
    }
  }, [data, loading]);

  // clear replay message and edite message state when channel change
  useEffect(() => {
    setReplayMessage(null);
    setEditeMessage(null);
  }, [channelId]);

  return (
    <MainLayout showChannelList={true} loading={loading}>
      <MessageContainer />
      <UserProfileModal />
      <ForwardMessageModal />
    </MainLayout>
  );
}
