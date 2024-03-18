import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller, set } from "react-hook-form";
import { createWorkspace } from "@/api";
import { WorkspacesSchemaTypes, NewWorkspacesSchema } from "@/shared/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import slugify from "slugify";
import { FiPlus } from "react-icons/fi";
import { ModalContainer, ModalTrigger } from "@/components/ui";
import { useAuthStore } from "@stores/index";
import toast from "react-hot-toast";
import { useStore } from "@stores/index";

export default function NewWorkspaceModal() {
  const { handleSubmit, control, watch, reset, setValue } = useForm<WorkspacesSchemaTypes>({
    resolver: yupResolver(NewWorkspacesSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [slugPreview, setSlugPreview] = useState("");
  const triggerRef = React.useRef<HTMLLabelElement>(null);
  const user = useAuthStore((state) => state.profile);
  const setOrUpdateWorkspace = useStore((state) => state.setOrUpdateWorkspace);

  const closeModal = () => {
    triggerRef.current?.click();
    reset();
  };

  const name = watch("name");

  // This useEffect will update the slugPreview state whenever the name changes
  useEffect(() => {
    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      setValue("slug", slug); // This sets the slug field value
      setSlugPreview(slug); // This updates the slug preview below the name input
    }
  }, [name, setValue]);

  const submit: SubmitHandler<WorkspacesSchemaTypes> = async (data, event) => {
    event?.preventDefault();

    if (user) {
      setLoading(true);
      try {
        const { data: newWorkspace } = await createWorkspace({
          created_by: user.id,
          ...data,
        });
        // TODO: get the new workspace and then add to the store
        // TODO: after create channle, close the modal also we need a loader here!
        // and then we need to update the channel list
        if (newWorkspace) {
          setOrUpdateWorkspace(newWorkspace.id, newWorkspace);
        }
        closeModal();
        toast.success("Workspace created successfully");
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
      <div className="tooltip tooltip-right" data-tip="Create Workspace">
        <ModalTrigger id="modal-create_workspace" className="btn btn-ghost btn-sm my-2 mt-6 rounded-btn">
          <FiPlus size={22} />
        </ModalTrigger>
      </div>

      <ModalContainer id="modal-create_workspace" triggerRef={triggerRef}>
        <p className="mb-6 text-lg font-bold">Create a new workspace</p>
        <form onSubmit={handleSubmit(submit)}>
          <div className="my-2">
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
                    <span className="label-text-alt">
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
          <div className="my-2">
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

          <div className="mt-10 flex w-full justify-between">
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
