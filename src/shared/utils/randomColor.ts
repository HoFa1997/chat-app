const hexColors = [
  "#507DAF",
  "#89CFF0",
  "#6D83A3",
  "#324A5E",
  "#A3BAC3",
  "#4A6583",
  "#B0C4DE",
  "#7B9EA8",
  "#5F7D8E",
  "#3E5A6F",
];

function stringToColorHash(inputString: string): number {
  let hash = 0,
    i,
    chr;
  if (inputString.length === 0) return hash;
  for (i = 0; i < inputString.length; i++) {
    chr = inputString.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export const getColorFromClass = (inputString: string): string => {
  const charIndex = Math.abs(stringToColorHash(inputString)) % inputString.length;
  const charCode = inputString.charCodeAt(charIndex);
  const colorIndex = charCode % hexColors.length;
  return hexColors[colorIndex];
};
