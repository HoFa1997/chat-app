"use client";
import { TMessageWithUser } from "@/api";
import { getColorFromClass } from "@/shared/utils";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useContextMenu } from "@/shared/hooks";
import { MessageContextMenu } from "./MessageContextMenu";

type TMessageCardProps = {
  data: TMessageWithUser;
  user: User;
};

export default function MessageCard({ data, user }: TMessageCardProps) {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const sanitizedHtml = DOMPurify.sanitize(data.content);
    setHtmlContent(sanitizedHtml);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextMenu = useContextMenu();

  return (
    <div
      className={"inline-flex w-fit my-1 bg-accent-color rounded-tg px-2 py-2 "}
      onContextMenu={contextMenu.showMenu}
    >
      <Image
        src={data?.user_id?.avatar_url ?? "https://avatars.dicebear.com/api/avataaars/1.svg"}
        width={40}
        height={40}
        alt="Avatar"
        className="w-10 h-10 rounded-full mr-2"
      />
      <div className="flex flex-col items-start">
        <p className={`text-xs`} style={{ color: getColorFromClass(data.user_id.username) }}>
          {data.user_id.username}
        </p>
        {/* <p className="text-base text-primary-text">{data.content}</p> */}
        <div className="text-base text-primary-text" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
      </div>
      {contextMenu.menuState.visible && <MessageContextMenu props={contextMenu} />}
    </div>
  );
}
