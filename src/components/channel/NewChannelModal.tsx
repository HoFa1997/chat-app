"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { User } from "@supabase/supabase-js";
import { newChannel } from "@/api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  FormControlLabel,
  Switch,
  MenuItem,
} from "@mui/material";
import { ChannelsSchemaType, NewChannelsSchema } from "@/shared/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabaseClient } from "@/api/supabase";
import { ChannelTypeEnum, createSlug } from "@/shared";
import { enqueueSnackbar } from "notistack";

export default function NewChannelModal() {
  const { handleSubmit, control, watch, reset, setValue } = useForm<ChannelsSchemaType>({
    resolver: yupResolver(NewChannelsSchema),
    defaultValues: {
      type: ChannelTypeEnum.PUBLIC,
      name: "",
      description: "",
      slug: "",
      member_limit: "" as any,
      is_avatar_set: false,
      allow_emoji_reactions: true,
      mute_in_app_notifications: false,
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const name = watch("name");

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (isOpen) {
      const fetchSession = async () => {
        const { data } = await supabaseClient.auth.getSession();
        if (data.session?.user) setUser(data.session.user);
      };
      fetchSession();
    }
  }, [isOpen]);

  useEffect(() => {
    if (name) {
      setValue("slug", createSlug(name));
    } else {
      setValue("slug", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const submit: SubmitHandler<ChannelsSchemaType> = async (data) => {
    if (user) {
      setLoading(true);
      try {
        await newChannel({ created_by: user.id, ...data });
        enqueueSnackbar("Channel created successfully", { variant: "success" });
        handleCloseModal();
      } catch (error: any) {
        enqueueSnackbar(error.message, { variant: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <>
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        New Chat Room
      </Button>
      <Dialog open={isOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Create a new chat room</DialogTitle>
        <form onSubmit={handleSubmit(submit)}>
          <DialogContent>
            <Controller
              control={control}
              name={"name"}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  autoFocus
                  {...field}
                  margin="dense"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : " "}
                />
              )}
            />
            <Controller
              control={control}
              name={"slug"}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  autoFocus
                  {...field}
                  margin="dense"
                  label="Slug"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : " "}
                />
              )}
            />
            <Controller
              control={control}
              name={"description"}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  autoFocus
                  {...field}
                  margin="dense"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : " "}
                />
              )}
            />
            <Controller
              control={control}
              name={"member_limit"}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Member Limit"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : " "}
                />
              )}
            />

            <Controller
              control={control}
              name={"type"}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Type"
                  select
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : " "}
                >
                  {Object.keys(ChannelTypeEnum).map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              control={control}
              name="is_avatar_set"
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Avatar Set"
                />
              )}
            />
            <Controller
              control={control}
              name="allow_emoji_reactions"
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Emoji Reactions"
                />
              )}
            />
            <Controller
              control={control}
              name="mute_in_app_notifications"
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Mute Notifications"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {loading ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
