"use client";
import React, { useEffect, useState } from "react";
import { TMessageWithUser } from "@/api";
import { getColorFromClass } from "@/shared/utils";
import { User } from "@supabase/supabase-js";
import DOMPurify from "dompurify";
import { useContextMenu } from "@/shared/hooks";
import { MessageContextMenu } from "./MessageContextMenu";
import { Box, Avatar, Typography, Card, CardContent } from "@mui/material";

type TMessageCardProps = {
  data: TMessageWithUser;
  user: User;
};

export default function MessageCard({ data }: TMessageCardProps) {
  const [htmlContent, setHtmlContent] = useState("");
  const contextMenu = useContextMenu();

  useEffect(() => {
    const sanitizedHtml = DOMPurify.sanitize(data.content);
    setHtmlContent(sanitizedHtml);
  }, [data.content]);

  return (
    <Box
      onContextMenu={contextMenu.showMenu}
      sx={{ my: 1, maxWidth: "50%", display: "inline-flex", borderRadius: "0 10px 10px 0", p: 2, bgcolor: "gray" }}
    >
      <Avatar
        src={data?.user_id?.avatar_url ?? "https://avatars.dicebear.com/api/avataaars/1.svg"}
        sx={{ width: 40, height: 40, mr: 2 }}
        alt="Avatar"
      />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
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
      </Box>
      {contextMenu.menuState.visible && <MessageContextMenu props={contextMenu} messageData={data} />}
    </Box>
  );
}
