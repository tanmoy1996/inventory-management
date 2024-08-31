import React, { FC } from "react";
import { IconButton } from "@mui/material";
import { useThemeContext } from "@/theme/ThemeContextProvider";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ToggleTheme: FC = () => {
  const { mode, toggleColorMode } = useThemeContext();
  return (
    <IconButton onClick={toggleColorMode}>
      {mode == "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default ToggleTheme;
