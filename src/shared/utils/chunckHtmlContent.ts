import { text } from "stream/consumers";

export const chunckHtmlContent = (htmlContent: any, maxLength: number) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  let currentTextLength = 0;
  let currentHtml = "";
  let textChunks: string[] = [""];
  let htmlChunks: string[] = [""];

  const addChunk = (node: any, textToAdd: string) => {
    if (currentTextLength + textToAdd.length > maxLength) {
      htmlChunks.push(currentHtml);
      textChunks.push("");
      currentHtml = "";
      currentTextLength = 0;
    }

    currentHtml += node.outerHTML || node.textContent;
    textChunks[textChunks.length - 1] += textToAdd;
    currentTextLength += textToAdd.length;
  };

  const traverseNodes = (node: any) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      addChunk(node, text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const openingTag = node.outerHTML.replace(node.innerHTML, "");
      currentHtml += openingTag;
      node.childNodes.forEach(traverseNodes);
      const closingTag = `</${node.tagName.toLowerCase()}>`;
      currentHtml += closingTag;
    }
  };

  doc.body.childNodes.forEach(traverseNodes);
  if (currentHtml) {
    htmlChunks.push(currentHtml);
  }

  htmlChunks = htmlChunks.filter((chunk) => chunk);
  textChunks = textChunks.filter((chunk) => chunk);

  if (htmlChunks.length !== textChunks.length) {
    throw new Error("htmlChunks and textChunks length mismatch");
  }

  return { htmlChunks, textChunks };
};
