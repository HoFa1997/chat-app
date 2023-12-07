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
  Box,
  Typography,
} from "@mui/material";
import { ChannelsSchemaType, NewChannelsSchema } from "@/shared/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabaseClient } from "@/api/supabase";
import { ChannelTypeEnum } from "@/shared";
import { enqueueSnackbar } from "notistack";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import slugify from "slugify";

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
  const [slugPreview, setSlugPreview] = useState("");

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

  // This useEffect will update the slugPreview state whenever the name changes
  useEffect(() => {
    if (name) {
      const slug = slugify(name, { lower: true });
      setValue("slug", slug); // This sets the slug field value
      setSlugPreview(slug); // This updates the slug preview below the name input
    }
  }, [name, setValue]);

  const submit: SubmitHandler<ChannelsSchemaType> = async (data, event) => {
    event?.preventDefault();
    console.log({
      user,
    });
    if (user) {
      setLoading(true);
      try {
        await newChannel({ created_by: user.id, ...data });
        enqueueSnackbar("Channel created successfully", { variant: "success" });
        handleCloseModal();
      } catch (error: any) {
        console.log(error);
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
                <Box>
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
                </Box>
              )}
            />
            <Controller
              control={control}
              name={"description"}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  autoFocus
                  margin="dense"
                  label="Description"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4} // Adjust the number of rows as needed
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

            <Box display="flex" justifyContent="space-between" alignItems="center" paddingY="10px">
              <Typography variant="caption" color="textSecondary">
                {slugPreview && `Slug will be: ${slugPreview}`}
              </Typography>
            </Box>

            <Box borderTop="1px solid #ddd" padding="8px 0">
              <Box display="flex" justifyContent="space-between" alignItems="center" paddingY="10px" width="100%">
                <Controller
                  control={control}
                  name="allow_emoji_reactions"
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          inputProps={{ "aria-label": "allow emoji reactions" }}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center">
                          <AddReactionIcon style={{ marginRight: "8px" }} />
                          Allow Emoji Reactions
                        </Box>
                      }
                      labelPlacement="start"
                      style={{ margin: 0, width: "100%", justifyContent: "space-between" }}
                    />
                  )}
                />
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" paddingY="10px" width="100%">
                <Controller
                  control={control}
                  name="mute_in_app_notifications"
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          inputProps={{ "aria-label": "mute in-app notifications" }}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center">
                          <VolumeOffIcon style={{ marginRight: "8px" }} />
                          Mute Notifications for everyone!
                        </Box>
                      }
                      labelPlacement="start"
                      style={{ margin: 0, width: "100%", justifyContent: "space-between" }}
                    />
                  )}
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions style={{ justifyContent: "space-between", padding: "8px 10px" }}>
            <Button onClick={handleCloseModal} color="primary" style={{ width: "50%" }}>
              Cancel
            </Button>
            <Button type="submit" color="primary" style={{ width: "50%" }}>
              {loading ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
