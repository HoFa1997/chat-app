"use client";
import React, { useEffect, useMemo, useState } from "react";
import { TMessageWithUser, emojiReaction } from "@/api";
import { getColorFromClass } from "@/shared/utils";
import { User } from "@supabase/supabase-js";
import DOMPurify from "dompurify";
import { useContextMenu } from "@/shared/hooks";
import { MessageContextMenu } from "./MessageContextMenu";
import { Box, Avatar, Typography, Stack, Chip, useTheme } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import MessageReaction from "./MessageReaction";

type TMessageCardProps = {
  data: TMessageWithUser;
  user: User | null;
};

const DEFAULT_AVATAR_URL = "https://avatars.dicebear.com/api/avataaars/1.svg";

const formatDateTime = (date: Date) => {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const getUserMessageStyle = (isCurrentUser: boolean, theme: any) => {
  const commonStyle = {
    my: 1,
    width: "60%",
    display: "flex",
    borderRadius: 3,
    position: "relative",
    ":before": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      top: 0,
      borderRadius: 1,
      borderStyle: "solid",
      borderWidth: "0 10px 20px 10px",
      rotate: "180deg",
    },
  };

  if (isCurrentUser) {
    return {
      ...commonStyle,
      p: 1,
      bgcolor: theme.palette.whatsAppGreen[100],
      marginLeft: "calc(40% - 10px)",
      ":before": {
        ...commonStyle[":before"],
        right: -10,
        borderColor: `transparent transparent ${theme.palette.whatsAppGreen[100]} transparent`,
      },
    };
  }

  return {
    ...commonStyle,
    px: 2,
    pt: 2,
    marginLeft: "10px",
    bgcolor: theme.palette.whatsAppGreen[200],
    ":before": {
      ...commonStyle[":before"],
      left: -10,
      borderColor: `transparent transparent ${theme.palette.whatsAppGreen[200]} transparent`,
    },
  };
};

function MessageCard({ data, user }: TMessageCardProps, ref: any) {
  const theme = useTheme();
  const [htmlContent, setHtmlContent] = useState("");
  const contextMenu = useContextMenu();

  useEffect(() => {
    const sanitizedHtml = DOMPurify.sanitize(data.html);
    setHtmlContent(sanitizedHtml);
  }, [data.html]);

  const userMessageStyle = getUserMessageStyle(data.user_id.id === user?.id, theme);

  const createdAt = useMemo(
    () => formatDateTime(new Date(data.edited_at ? data.edited_at : data.created_at)),
    [data.edited_at, data.created_at],
  );

  const countRepliedMessages = data.metadata?.replied?.length;

  const currentUserReactionSyle = {
    backgroundColor: "#1264a3",
    cursor: "pointer",
  };

  return (
    <Box onContextMenu={contextMenu.showMenu} sx={{ ...userMessageStyle }} ref={ref}>
      <Avatar
        src={data?.user_id?.avatar_url ?? DEFAULT_AVATAR_URL}
        sx={{ width: 40, height: 40, mr: 2 }}
        alt="User Avatar"
      />
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "start" }}>
        {data.reply_to_message_id && (
          <Box sx={{ bgcolor: (t) => t.palette.background.paper, p: 2, borderRadius: 5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ color: getColorFromClass(data?.reply_to_message_id.user_id?.username) }}
            >
              {data?.reply_to_message_id.user_id?.username}
            </Typography>
            <Typography variant="body1">{data?.replied_message_preview}</Typography>
          </Box>
        )}
        <Typography mt={1} variant="caption" sx={{ color: getColorFromClass(data.user_id.username) }}>
          {data.user_id.username}
        </Typography>

        <Box
          className="message--card__content"
          dir="auto"
          sx={{ typography: "body1", color: "text.primary", lineHeight: "1rem" }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <Box marginLeft="auto" marginTop="2px" display="flex" alignItems="center">
          <MessageReaction message={data} />

          <Stack direction="row" spacing={1} margin="0 4px">
            {data?.reactions &&
              Object.keys(data?.reactions).map((reaction: string, index: number) => (
                <Chip
                  style={
                    data?.reactions[reaction]?.find((x: any) => x.user_id === user?.id)
                      ? currentUserReactionSyle
                      : {
                          backgroundColor: "#aaa",
                          cursor: "pointer",
                        }
                  }
                  key={index}
                  onClick={() => emojiReaction(data, reaction)}
                  label={reaction + " " + data?.reactions[reaction].length}
                />
              ))}
          </Stack>

          <Box margin={"0 20px"}>
            {countRepliedMessages && (
              <Typography variant="subtitle2" display="flex" alignItems="center">
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

export default React.forwardRef(MessageCard);
