import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      colors: {
        background: "#18222D",
        "primary-text": "#ECEFF1",
        "secondary-text": "#B0BEC5",
        "accent-color": "#5294E2",
        "incoming-bubble": "#2C2F3A",
        "outgoing-bubble": "#4B5162",
        "menu-background": "#313740",
        "notification-color": "#FF4B55",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        base: "14px",
        xs: "12px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
