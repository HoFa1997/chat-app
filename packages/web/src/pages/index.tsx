import { WorkspaceSelectionPrompt } from "@/components/prompts";
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";

export default function Page() {
  return (
    <MainLayout>
      <WorkspaceSelectionPrompt />
    </MainLayout>
  );
}
