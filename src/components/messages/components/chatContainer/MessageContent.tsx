import React, { useEffect, useState, useMemo } from "react";
import DOMPurify from "dompurify";
import { isOnlyEmoji, splitEmojis } from "@/shared";
interface MessageContentProps {
  data: {
    content: string;
    html?: string;
  };
}

const MessageContent: React.FC<MessageContentProps> = ({ data }) => {
  const sanitizedHtml = useMemo(() => {
    return data.html ? DOMPurify.sanitize(data.html) : data.content;
  }, [data.html, data.content]);

  const [htmlContent, setHtmlContent] = useState(sanitizedHtml);

  useEffect(() => {
    setHtmlContent(sanitizedHtml);
  }, [sanitizedHtml]);

  // Check if the content is only emoji outside of JSX for readability.
  const contentIsOnlyEmoji = isOnlyEmoji(data.content);

  return (
    <div className="flex flex-col">
      {contentIsOnlyEmoji ? (
        <div>
          {splitEmojis(data.content)?.map((emoji: string, index: number) => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <em-emoji key={index} native={emoji} size="4rem"></em-emoji>
          ))}
        </div>
      ) : (
        <div
          className="message--card__content prose-slate prose-invert"
          dir="auto"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </div>
  );
};

export default MessageContent;
