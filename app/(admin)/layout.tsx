"use client";
import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import { SideBar, SideBarSm } from "@/components/layout/SideBar";
import AppHeader from "@/components/layout/AppHeader";
import AppContent from "@/components/layout/AppContent";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store";

interface PropsType {
  title: string;
  children: ReactNode;
}

const RootLayout = ({ title, children }: Readonly<PropsType>) => {
  return (
    <Box display="flex" className="max-w-screen min-h-screen overflow-x-hidden">
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <SideBar />
      </Box>
      <Box sx={{ display: { xs: "none", sm: "block", position: "relative" } }}>
        <SideBarSm />
      </Box>
      <Box minHeight="100vh" className="grow overflow-x-hidden px-2 sm:px-3">
        <AppHeader />
        <AppContent>{children}</AppContent>
      </Box>
    </Box>
  );
};

export default RootLayout;
