import React, { useEffect } from "react";
import { useStore } from "@stores/index";
import { getChannelsByWorkspaceAndUserids } from "@/api";
import MainLayout from "@/components/layouts/MainLayout";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { UserProfileModal } from "@/components/messages/components/UserProfileModal";
import ForwardMessageModal from "@/components/messages/components/ForwardMessageModal";
import { ChatPanelContainer } from "@/components/messages/ChatPanelContainer";
import { ChannelSelectionPrompt } from "@/components/prompts";

type TWorkspacePageProp = {
  workspaceId: string;
  channelId: string;
  channels: any;
};

export default function WorkspacesPage({ workspaceId, channelId, channels }: TWorkspacePageProp) {
  const setWorkspaceSetting = useStore((state) => state.setWorkspaceSetting);
  const clearAndInitialChannels = useStore((state) => state.clearAndInitialChannels);

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
    useStore.getState().setForwardMessageMemory(channelId, null);
    useStore.getState().setEditMessageMemory(channelId, null);
    useStore.getState().setReplayMessageMemory(channelId, null);
    useStore.getState().setStartThreadMessage(null);
    setWorkspaceSetting("activeChannelId", channelId);
  }, [channelId]);

  return (
    <MainLayout showChannelList={true}>
      {channelId ? <ChatPanelContainer /> : <ChannelSelectionPrompt />}
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
  let channels = [];

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    if (session?.user) {
      const workspaceChannels = await getChannelsByWorkspaceAndUserids(
        workspaceId,
        session.user.id,
      );

      //@ts-ignore
      // TODO: need db function to get all channels by workspaceId and not thread
      channels =
        workspaceChannels.data
          .filter((x) => x.workspace.type !== "THREAD")
          .map((x) => ({ ...x, ...x.workspace })) || []; //data || [];
    }

    return {
      props: {
        workspaceId,
        channelId,
        channels,
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
