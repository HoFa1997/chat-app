export const isOnlyEmoji = (str: string): boolean => {
  const emojiRegex =
    /^(\p{Emoji}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\u200d)+$/u;
  return emojiRegex.test(str);
};

export const splitEmojis = (str: string): string[] => {
  // Regular expression to match a single emoji
  const emojiRegex = /\p{Extended_Pictographic}/gu;

  // Using match to find all emojis and then join them with new lines
  const emojis = str.match(emojiRegex);
  return emojis ? emojis.join("\n").split("\n") : [];
};