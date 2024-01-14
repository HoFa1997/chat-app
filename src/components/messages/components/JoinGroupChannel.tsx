"use client";
import { supabaseClient } from "@/api/supabase";
import { useCallback } from "react";
import { useStore } from "@stores/index";
import { useRouter } from "next/router";
import { useAuthStore } from "@stores/index";

export default function JoinGroupChannel() {
  const { channelId } = useStore((state: any) => state.workspaceSettings);
  const user = useAuthStore.getState().profile;
  const router = useRouter();

  // TODO: move to api layer
  const joinToChannel = useCallback(async () => {
    try {
      const { error } = await supabaseClient
        .from("channel_members")
        .upsert({ channel_id: channelId, member_id: user?.id });
      router.reload();
      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }, [user, channelId]);

  if (!user || !channelId) return null;

  return (
    <div className="flex w-full flex-col items-center justify-center p-2">
      <button className="btn btn-block" onClick={joinToChannel}>
        Join Channel
      </button>
    </div>
  );
}
