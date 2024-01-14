import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useStore } from "@stores/index";
import { getChannels } from "@/api";
import { useApi } from "@/shared/hooks/useApi";
import MainLayout from "@/components/layouts/MainLayout";

export default function WorkspacesPage() {
  const router = useRouter();
  const { workspaceId } = router.query;
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

  return (
    <MainLayout showChannelList={true} loading={loading}>
      <span></span>
    </MainLayout>
  );
}
