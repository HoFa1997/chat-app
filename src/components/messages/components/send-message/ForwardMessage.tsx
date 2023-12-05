"use client";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { TChannel } from "@/api";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { setForwardMessage, useForwardMessageInfo } from "@/shared/hooks";
import { supabaseClient } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
export type TChannels = Database["public"]["Tables"]["channels"]["Row"];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

type TForwardMessageProps = {
  user: User;
};

type FormData = { channel_id: string };

export const ForwardMessage = ({ user }: TForwardMessageProps) => {
  const [open, setOpen] = React.useState(false);
  const forwardedMessage = useForwardMessageInfo();
  const [channels, setChannels] = React.useState<TChannels[]>([]);

  useEffect(() => {
    const getChannels = async () => {
      const { data } = await supabaseClient
        .from("channels")
        .select("*, channel_members (member_id)")
        .eq("channel_members.member_id", user.id);

      console.log({ data });
      data && setChannels(data);
    };
    getChannels();
  }, []);

  React.useEffect(() => {
    if (forwardedMessage) {
      setOpen(true);
    }
  }, [forwardedMessage]);

  const { handleSubmit, watch, setValue } = useForm<FormData>({
    mode: "onBlur",
  });

  const submit: SubmitHandler<FormData> = async ({ channel_id }) => {
    await supabaseClient
      .from("messages")
      .insert({
        channel_id,
        user_id: user.id,
        original_message_id: forwardedMessage?.id,
      })
      .then(() => handleClose());
  };

  const handleClose = () => {
    setOpen(false);
    setForwardMessage(null);
  };

  if (!forwardedMessage) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="forward-message-modal-title"
      aria-describedby="forward-message-modal-description"
    >
      <Box sx={style}>
        <Typography id="forward-message-modal-title" variant="h6" component="h2">
          Forward Message
        </Typography>
        <Typography id="forward-message-modal-description" sx={{ mt: 2 }}>
          {forwardedMessage.content}
        </Typography>
        <List>
          {channels.map((channel) => (
            <ListItemButton
              key={channel.id}
              onClick={() => {
                setValue("channel_id", channel.id);
              }}
              selected={channel.id === watch("channel_id")}
            >
              <ListItemText primary={channel.name} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" sx={{ ml: 1 }} onClick={handleSubmit(submit)}>
            Forward
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
