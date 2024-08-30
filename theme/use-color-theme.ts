"use client"
import { createTheme, PaletteMode } from "@mui/material";
import React from "react";
import {getDesignTokens} from "@/theme";

export const useColorTheme = () => {
  const [mode, setMode] = React.useState<PaletteMode>("light");

  const toggleColorMode = () =>{
    console.log('in use-color-theme')
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }

  const modifiedTheme = React.useMemo(
    () => createTheme(getDesignTokens(mode) as any),
    [mode]
  );

  return {
    theme: modifiedTheme,
    mode,
    toggleColorMode,
  };
};