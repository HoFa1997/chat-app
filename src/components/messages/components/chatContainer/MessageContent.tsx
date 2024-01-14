import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface MessageContentProps {
  data: {
    content: string;
    html?: string;
  };
}

const sanitizeContent = (data: MessageContentProps["data"]): string => {
  return data.html ? DOMPurify.sanitize(data.html) : data.content;
};

const MessageContent: React.FC<MessageContentProps> = ({ data }) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    setHtmlContent(sanitizeContent(data));
  }, [data]);

  return (
    <div className="flex flex-col">
      <div className="message--card__content" dir="auto" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
    </div>
  );
};

export default MessageContent;
