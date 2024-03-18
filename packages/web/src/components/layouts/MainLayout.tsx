import React, { ReactNode } from "react";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import ChannelList from "@/components/channel/ChannelList";

interface MainLayoutProps {
  children: ReactNode;
  showChannelList?: boolean;
  loading?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showChannelList = false, loading = false }) => {
  return (
    <div className="flex h-dvh max-w-full flex-row bg-base-300">
      <WorkspaceSidebar />
      {showChannelList && <ChannelList loading={loading} />}
      {children}
    </div>
  );
};

export default MainLayout;
