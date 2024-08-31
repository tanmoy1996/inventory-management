"use client";
import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppSelector, useAppDispatch, useAppStore } from "@/hooks";
import { toggleNavbar } from "@/store/slices/global";
import { RootState } from "@/store";
import { usePathname } from "next/navigation";
import Profile from "@/components/layout/Profile";
import ToggleTheme from "./Toggletheme";

const AppHeader = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { navBarMobileClosing } = useAppSelector(
    (state: RootState) => state.global
  );

  const [currentRoute, setCurrentRoute] = useState("");

  useEffect(() => {
    let currentPath = "";
    if (pathname?.includes("/projects/")) {
      currentPath = "Project Details";
    } else if (pathname?.includes("/employees/")) {
      currentPath = "Employee Details";
    } else {
      currentPath = pathname?.split("/")?.reverse()?.[0] ?? "";
    }
    setCurrentRoute(currentPath);
  }, [pathname]);

  const handleDrawerToggle = () => {
    if (!navBarMobileClosing) {
      dispatch(toggleNavbar());
    }
  };

  return (
    <>
      <Toolbar disableGutters className="flex justify-between w-full h-[60px]">
        <Box className="flex items-center">
          <Box display={{ xs: "block", sm: "none" }}>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography
            variant="h6"
            className="font-bold text-2xl capitalize"
            sx={{ color: theme.palette.primary.dark }}
          >
            {currentRoute.replace("-", " ")}
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <ToggleTheme />
          <Profile />
        </Box>
      </Toolbar>
    </>
  );
};

export default AppHeader;
