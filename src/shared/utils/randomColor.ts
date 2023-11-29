const hexColors = [
  "#ffffff", // White text
  "#000000", // Black text
  "#FF5733", // A contrasting color
  "#33FF57", // Another contrasting color
  "#FFD700", // Gold/Yellow text
  "#FF69B4", // Pink text
  "#9400D3", // Purple text
  "#00FF00", // Green text
  // Add more colors as needed
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
