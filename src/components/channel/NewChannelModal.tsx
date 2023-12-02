"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { User } from "@supabase/supabase-js";
import { newChannel } from "@/api";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from "@mui/material";

type NewChannelModalProps = {
  userData: User;
};

type FormData = { channelSlug: string; name: string };

export default function NewChannelModal({ userData: user }: NewChannelModalProps) {
  const { handleSubmit, register, watch, reset } = useForm<FormData>({ mode: "onBlur" });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit: SubmitHandler<FormData> = async ({ channelSlug, name }) => {
    setLoading(true);
    await newChannel(user.id, channelSlug, name).then((res) => {
      if (res) {
        reset();
        setLoading(false);
        setIsOpen(false);
      }
    });
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
            <TextField
              autoFocus
              margin="dense"
              id="channelSlug"
              label="Chat Room Name"
              type="text"
              fullWidth
              variant="outlined"
              {...register("name")}
            />
            <TextField
              autoFocus
              margin="dense"
              id="channelSlug"
              label="Chat Room Slug"
              type="text"
              fullWidth
              variant="outlined"
              {...register("channelSlug")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={!watch("channelSlug")}>
              {loading ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
