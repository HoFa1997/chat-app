import React, { useEffect } from "react";
import { useStore } from "@stores/index";
import { getChannels } from "@/api";
import MainLayout from "@/components/layouts/MainLayout";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import MessageContainer from "@/components/messages/MessageContainer";
import { UserProfileModal } from "@/components/messages/components/UserProfileModal";
import ForwardMessageModal from "@/components/messages/components/ForwardMessageModal";

type TWorkspacePageProp = {
  workspaceId: string;
  channelId: string;
  channels: any;
};

export default function WorkspacesPage({ workspaceId, channelId, channels }: TWorkspacePageProp) {
  const setWorkspaceSetting = useStore((state) => state.setWorkspaceSetting);
  const clearAndInitialChannels = useStore((state) => state.clearAndInitialChannels);
  const setReplayMessageMemory = useStore((state) => state.setReplayMessageMemory);
  const setEditeMessageMemory = useStore((state) => state.setEditeMessageMemory);
  const setForwardMessageMemory = useStore((state) => state.setForwardMessageMemory);

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
    if (!channelId) return;
    setReplayMessageMemory(null);
    setEditeMessageMemory(null);
    setForwardMessageMemory(null);
    setWorkspaceSetting("channelId", channelId);
  }, [channelId]);

  return (
    <MainLayout showChannelList={true}>
      {channelId ? <MessageContainer /> : <span></span>}
      <UserProfileModal />
      <ForwardMessageModal />
    </MainLayout>
  );
}

// TODO: check the workspace and channels in here! for improve perfomance and better UX

export async function getServerSideProps(context: any) {
  const workspaceId = context.params?.workspaceId.at(0);
  const channelId = context.params?.workspaceId.at(1) || null;

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
