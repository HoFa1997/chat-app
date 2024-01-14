import { ChatContainer } from "@/components/chat";
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";

export default function Page() {
  return (
    <MainLayout>
      <ChatContainer />
    </MainLayout>
  );
}
