"use client";
import { newChannel } from "@/api";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type NewChannelModalProps = {
  userData: User;
};

type FromData = { channelSlug: string };
export default function NewChannelModal({ userData: user }: NewChannelModalProps) {
  const { handleSubmit, register, watch, reset } = useForm<FromData>({ mode: "onBlur" });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit: SubmitHandler<FromData> = async ({ channelSlug }) => {
    setLoading(true);
    await newChannel(user.id, channelSlug).then((res) => {
      if (res) {
        reset();
        setLoading(false);
        setIsOpen(false);
      }
    });
  };

  const handelCloseModal = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-4"
      >
        New Chat Room
      </button>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto ">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 "></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <form
              onSubmit={handleSubmit(submit)}
              className="inline-block align-bottom  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4  sm:p-6 sm:pb-4 ">
                <div className="sm:flex sm:items-start ">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create a new chat room</h3>
                    <input
                      type="text"
                      id="name"
                      className="mt-2 shadow-sm focus:ring-blue-500 p-4 outline-gray-500 focus:border-blue-500 block w-full sm:text-sm border-gray-500 text-black rounded-md"
                      placeholder="Enter a name for the chat room"
                      {...register("channelSlug")}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300"
                  disabled={!watch("channelSlug")}
                >
                  {loading ? "Loading" : "Create"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handelCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
