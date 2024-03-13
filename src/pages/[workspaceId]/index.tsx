import React, { useEffect } from "react";
import { useStore } from "@stores/index";
import { getChannels } from "@/api";
import MainLayout from "@/components/layouts/MainLayout";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

type TWorkspacePageProp = {
  workspaceId: string;
  channels: any;
};

export default function WorkspacesPage({ workspaceId, channels }: TWorkspacePageProp) {
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

  return (
    <MainLayout showChannelList={true}>
      <span></span>
    </MainLayout>
  );
}

// TODO: check the workspace and channels in here! for improve perfomance and better UX

export async function getServerSideProps(context: any) {
  const { workspaceId } = context.params;
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
