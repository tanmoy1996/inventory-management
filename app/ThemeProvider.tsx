"use client";
import { ThemeProvider } from "@mui/material/styles";
import { useThemeContext } from "@/theme/ThemeContextProvider";
import { CssBaseline } from "@mui/material";

export default function DesignProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
