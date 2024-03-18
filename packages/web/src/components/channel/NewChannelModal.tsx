import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { newChannel } from "@/api";
import { ChannelsSchemaType, NewChannelsSchema } from "@/shared/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChannelTypeEnum } from "@/shared";
import slugify from "slugify";
import { useStore, useAuthStore } from "@stores/index";
import { BiVolumeMute } from "react-icons/bi";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { ModalContainer, ModalTrigger } from "@/components/ui";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function NewChannelModal() {
  const router = useRouter();
  const setOrUpdateChannel = useStore((state) => state.setOrUpdateChannel);
  const { handleSubmit, control, watch, reset, setValue } = useForm<ChannelsSchemaType>({
    resolver: yupResolver(NewChannelsSchema),
    defaultValues: {
      type: ChannelTypeEnum.PUBLIC,
      name: "",
      description: "",
      slug: "",
      allow_emoji_reactions: true,
      mute_in_app_notifications: false,
    },
  });
  const { workspaceId } = useStore((state) => state.workspaceSettings);
  const [loading, setLoading] = useState(false);
  const [slugPreview, setSlugPreview] = useState("");
  const triggerRef = React.useRef<any>(null);
  const user = useAuthStore((state) => state.profile);

  const closeModal = () => {
    triggerRef.current?.click();
    reset();
  };

  const name = watch("name");

  // This useEffect will update the slugPreview state whenever the name changes
  useEffect(() => {
    if (name.length === 0) setSlugPreview("");

    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      setValue("slug", slug); // This sets the slug field value
      setSlugPreview(slug); // This updates the slug preview below the name input
    }
  }, [name, setValue]);

  const submit: SubmitHandler<ChannelsSchemaType> = async (data, event) => {
    event?.preventDefault();

    if (user) {
      setLoading(true);
      try {
        const { data: NEWChannel, error } = await newChannel({
          created_by: user.id,
          workspace_id: workspaceId as string,
          ...data,
        });
        // TODO: after create channle, close the modal also we need a loader here!
        // and then we need to update the channel list,
        // otherwise in the channelId page, we have realtime listener for this
        if (!router.query.channelId) {
          setOrUpdateChannel(NEWChannel.id, NEWChannel);
        }

        router.push(`/${workspaceId}/${NEWChannel?.id}`);
        closeModal();
        toast.success("Channel created successfully");
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <ModalTrigger id="modal-new_chatroom" className="btn btn-active btn-sm btn-block">
        New Chat Room
      </ModalTrigger>

      <ModalContainer id="modal-new_chatroom" triggerRef={triggerRef}>
        <p className="mb-2 text-lg font-bold">Create a new chat room</p>
        <form onSubmit={handleSubmit(submit)}>
          <div>
            <Controller
              control={control}
              name={"name"}
              render={({ field, fieldState: { error } }) => (
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Name</span>
                  </div>
                  <input {...field} type="text" placeholder="Name" className="input input-bordered w-full " />
                  <div className="label">
                    <span className="label-text-alt">{error ? error.message : ""}</span>
                    <span className="label-text-alt min-h-4">
                      {slugPreview && (
                        <span>
                          <b>Slug:</b> {slugPreview}
                        </span>
                      )}
                    </span>
                  </div>
                </label>
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"description"}
              render={({ field, fieldState: { error } }) => (
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Description</span>
                  </div>
                  <textarea
                    {...field}
                    rows={4}
                    className="textarea textarea-bordered w-full"
                    placeholder="Description"
                  ></textarea>
                  <div className="label">
                    <span className="label-text-alt">{error ? error.message : ""}</span>
                    <span className="label-text-alt">You can change it later!</span>
                  </div>
                </label>
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"type"}
              render={({ field, fieldState: { error } }) => (
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Channel Type</span>
                  </div>
                  <select {...field} className="select select-bordered w-full ">
                    <option disabled value="">
                      Pick your channel type
                    </option>

                    {Object.keys(ChannelTypeEnum).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                  <div className="label">
                    <span className="label-text-alt">{error ? error.message : " "}</span>
                  </div>
                </label>
              )}
            />
          </div>

          <div className="divider my-1"></div>

          <div className="collapse collapse-plus bg-base-200">
            <input type="checkbox" className="peer" />
            <div className="collapse-title bg-base-100 p-4 text-primary-content peer-checked:bg-base-200 peer-checked:text-secondary-content">
              More options:
            </div>
            <div className="collapse-content  bg-base-100 text-primary-content peer-checked:bg-base-200 peer-checked:text-secondary-content">
              <div>
                <div>
                  <Controller
                    control={control}
                    name="allow_emoji_reactions"
                    render={({ field }) => (
                      <div className="form-control flex justify-between">
                        <label className="label cursor-pointer">
                          <div>
                            <div className="flex items-center">
                              <MdOutlineEmojiEmotions size={26} className="mr-2" />
                              Allow Emoji Reactions
                            </div>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="toggle"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </div>
                        </label>
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="mute_in_app_notifications"
                    render={({ field }) => (
                      <div className="form-control flex justify-between">
                        <label className="label cursor-pointer">
                          <div>
                            <div className="flex items-center">
                              <BiVolumeMute size={24} className="mr-2" />
                              Mute Notifications for everyone!
                            </div>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="toggle"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </div>
                        </label>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex w-full justify-between">
            <button className="btn btn-neutral w-1/6" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-secondary  w-4/6" type="submit" disabled={loading}>
              Create
              {loading && <span className="loading loading-spinner loading-md ml-auto"></span>}
            </button>
          </div>
        </form>
      </ModalContainer>
    </>
  );
}
