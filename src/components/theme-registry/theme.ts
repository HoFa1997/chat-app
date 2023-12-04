import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { ColorPartial } from "@mui/material/styles/createPalette";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

declare module "@mui/material/styles" {
  interface Palette {
    whatsAppGreen: ColorPartial;
  }

  interface PaletteOptions {
    whatsAppGreen?: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#25D366", // WhatsApp Signature Green
      contrastText: "#FFFFFF", // White text on primary color
    },
    secondary: {
      main: "#34B7F1", // Blue for links
      contrastText: "#FFFFFF", // White text on secondary color
    },
    background: {
      default: "#121212", // Dark Grey for primary background
      paper: "#1E1E1E", // Slightly lighter Grey for paper elements
    },
    text: {
      primary: "#FFFFFF", // White for primary text
      secondary: "#CCCCCC", // Light Grey for secondary text
    },
    error: {
      main: "#FF3B30", // Red for errors and notifications
    },
    warning: {
      main: "#FFAB00", // Yellow for warnings and highlights
    },
    info: {
      main: "#34B7F1", // Blue for informational messages
    },
    success: {
      main: "#25D366", // Green for success states
    },
    divider: "#2C2C2C", // Dark Grey for borders and separators
    action: {
      hover: "#292929", // Slightly lighter Grey for hover state
      selected: "#0A8D48", // Darker Green for active state
    },
    grey: {
      800: "#333333", // Dark Grey for input fields
    },
    whatsAppGreen: {
      100: "#265b4c",
      200: "#222c32",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
