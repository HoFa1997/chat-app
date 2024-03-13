import MessageContainer from "@/components/messages/MessageContainer";
import React, { useEffect } from "react";
import { UserProfileModal } from "@/components/messages/components/UserProfileModal";
import { useStore } from "@stores/index";
import { getChannels } from "@/api";
import { useApi } from "@/shared/hooks/useApi";
import MainLayout from "@/components/layouts/MainLayout";
import ForwardMessageModal from "@/components/messages/components/ForwardMessageModal";
import { setReplayMessage, setEditeMessage } from "@/shared/hooks";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

type TRoomProps = {
  workspaceId: string;
  channelId: string;
  channels: any;
};

export default function ChatRoomContainer({ workspaceId, channelId, channels }: TRoomProps) {
  const setWorkspaceSetting = useStore((state) => state.setWorkspaceSetting);
  const clearAndInitialChannels = useStore((state) => state.clearAndInitialChannels);
  const { loading, data, request } = useApi(getChannels, workspaceId, false);

  useEffect(() => {
    if (!workspaceId) return;
    setWorkspaceSetting("workspaceId", workspaceId);
  }, [workspaceId]);

  useEffect(() => {
    if (!channels) return;
    clearAndInitialChannels(channels);
  }, [channels]);

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

export async function getServerSideProps(context: any) {
  const { workspaceId, channelId } = context.params;
  const supabase = createPagesServerClient(context);
  let channels;

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (data.session?.user) {
      channels = await getChannels(workspaceId);
    }

    return {
      props: {
        workspaceId,
        channelId,
        channels: channels.data,
      },
    };
  } catch (error: any) {
    console.error("getServerSideProps error:", error);
    return {
      redirect: {
        destination: `/500?error=${encodeURIComponent(error.message)}`,
        permanent: false,
      },
    };
  }
}
