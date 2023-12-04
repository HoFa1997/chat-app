"use client";
import React, { useEffect, useState } from "react";
import { TMessageWithUser } from "@/api";
import { getColorFromClass } from "@/shared/utils";
import { User } from "@supabase/supabase-js";
import DOMPurify from "dompurify";
import { useContextMenu } from "@/shared/hooks";
import { MessageContextMenu } from "./MessageContextMenu";
import { Box, Avatar, Typography, Card, CardContent } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";

type TMessageCardProps = {
  data: TMessageWithUser;
  user: User;
};

export default function MessageCard({ data, user }: TMessageCardProps) {
  const [htmlContent, setHtmlContent] = useState("");
  const contextMenu = useContextMenu();

  useEffect(() => {
    const sanitizedHtml = DOMPurify.sanitize(data.content);
    setHtmlContent(sanitizedHtml);
  }, [data.content]);

  const userMessageStyle =
    data.user_id.id == user.id
      ? {
          my: 1,
          width: "49%",
          display: "flex",
          borderRadius: "10px 0 0 10px",
          p: 2,
          bgcolor: "gray",
          marginLeft: "auto",
        }
      : { my: 1, width: "49%", display: "flex", borderRadius: "0 10px 10px 0", p: 2, bgcolor: "gray" };

  const createdAt = new Date(data.edited_at ? data.edited_at : data.created_at).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const countRepliedMessages = data.metadata?.replied.length;

  return (
    <Box onContextMenu={contextMenu.showMenu} sx={{ ...userMessageStyle }}>
      <Avatar
        src={data?.user_id?.avatar_url ?? "https://avatars.dicebear.com/api/avataaars/1.svg"}
        sx={{ width: 40, height: 40, mr: 2 }}
        alt="Avatar"
      />
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "start" }}>
        {data.reply_to_message_id && (
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ color: getColorFromClass(data.user_id.username) }}
              >
                {data?.reply_to_message_id.user_id?.username}
              </Typography>
              <Typography variant="body1">{data?.replied_message_preview}</Typography>
            </CardContent>
          </Card>
        )}
        <Typography variant="caption" sx={{ color: getColorFromClass(data.user_id.username) }}>
          {data.user_id.username}
        </Typography>
        <Box sx={{ typography: "body1", color: "text.primary" }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <Box marginLeft="auto" marginTop="2px" display="flex" alignContent="center">
          <Box margin={"0 20px"}>
            {countRepliedMessages && (
              <Typography variant="subtitle2" display="flex" align="center" alignItems="center">
                {countRepliedMessages}
                <ReplyIcon />
              </Typography>
            )}
          </Box>
          <Typography variant="subtitle2"> {createdAt}</Typography>
        </Box>
      </Box>
      {contextMenu.menuState.visible && <MessageContextMenu props={contextMenu} messageData={data} />}
    </Box>
  );
}
