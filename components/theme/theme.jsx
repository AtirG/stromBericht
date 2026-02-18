"use client";
import { createTheme, alpha } from "@mui/material/styles";

const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#ffffff" : "#0f1a29",
      },
      background: {
        default: mode === "dark" ? "rgb(15, 26, 41)" : "rgb(250, 250, 255)",
        paper: mode === "dark" ? "rgb(23, 37, 56)" : "#ffffff",
        darker:
          mode === "dark" ? alpha("#000000", 0.45) : alpha("#000000", 0.05),
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#0f1a29",
        secondary: mode === "dark" ? "#b0b8c4" : "#4b5563",
      },
    },
    typography: {
      fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
};

export default getTheme;
