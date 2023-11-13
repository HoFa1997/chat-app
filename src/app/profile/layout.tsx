import ChatLayout from "@/shared/layout/ChatLayout";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <ChatLayout>{children}</ChatLayout>;
};

export default layout;
