"use client";
import { supabaseClient } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Tiptap } from "../tiptap/tiptap";

type SendMessageProps = {
  channelId: string;
  user: User;
};
type FromData = { content: string };
export default function SendMessage({ channelId, user }: SendMessageProps) {
  const { refresh } = useRouter();
  const { handleSubmit, register, watch, reset } = useForm<FromData>({ mode: "onBlur" });
  const [loading, setLoading] = useState(false);

  const submit: SubmitHandler<FromData> = async ({ content }) => {
    setLoading(true);
    await supabaseClient
      .from("messages")
      .insert({
        content,
        channel_id: channelId,
        user_id: user.id,
      })
      .select()
      .then((res) => {
        reset();
        setLoading(false);
      });
  };

  useEffect(() => {
    const channel = supabaseClient
      .channel("realtime_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => refresh(),
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [refresh]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className=" flex flex-row  w-full min-h-[50px] bg-slate-50  rounded-lg overflow-hidden p-2"
    >
      {/* <input
        {...register("content")}
        type="text"
        className="w-full h-full rounded-lg border border-gray-300 mr-2 px-2 focus:outline-none "
        placeholder="Enter Message here!"
      /> */}
      <Tiptap />
      <button
        type="submit"
        disabled={!watch("content")}
        className="p-2 bg-blue-500 rounded-lg text-white flex justify-center items-center hover:bg-blue-300 transition-all disabled:bg-gray-300"
      >
        {loading ? "Loading" : "Send"}
      </button>
    </form>
  );
}
