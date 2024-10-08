"use client";
import { Roboto } from "next/font/google";
import { PaletteMode } from "@mui/material";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            // main: "#26a69a",
            main: "#000000",
            dark: "#484848",
          },
          secondary: {
            // main: "#4527a0",
            main: "#00B8D4",
          },
          success: {
            main: "#33a639",
          },
          error: {
            main: "#c62828",
          },
          info: {
            main: "#0288d1",
          },
        }
      : {
          // palette values for dark mode
          primary: {
            // main: "#81ccc4",
            // dark: "#12c7b5",
            // contrastText: "#303030",
            main: "#ffffff",
            dark: "#d6d6d6",
          },
          secondary: {
            // main: "#b388ff",
            main: "#00B8D4",
          },
          success: {
            main: "#00c853",
          },
          error: {
            main: "#e53935",
          },
          info: {
            main: "#039be5",
          },
        }),
  },
  typography: {
    fontWeightLight: 400,
    fontSize: 14,
    h1: {
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.15,
    },
    h2: {
      fontSize: 36,
      fontWeight: 600,
    },
    h3: {
      fontSize: 30,
      fontWeight: 500,
    },
    h4: {
      fontSize: 24,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: 20,
    },
    h6: {
      fontSize: 18,
      lineHeight: 1.75,
    },
    subtitle1: {
      lineHeight: 1.5,
    },
  },
  props: {
    MuiTooltip: {
      arrow: true,
    },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
        },
      },
    },
  },
});

// export default theme;
