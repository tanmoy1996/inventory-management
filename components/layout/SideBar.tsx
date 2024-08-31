"use strict";

import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";

import {
  Box,
  Drawer,
  Typography,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import Zoom from "@mui/material/Zoom";
import dashboardRoutes from "@/routes";
import { useAppSelector, useAppDispatch } from "@/hooks";
import {
  setNavBarDesktopMini,
  setNavBarMobileClosing,
  setNavBarMobileOpen,
} from "@/store/slices/global";
import { RootState } from "@/store";
import Link from "next/link";

const drawerWidth = 240;
const miniWidth = 100;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  height: "60px",
}));

export const SideBar = () => {
  const theme = useTheme();

  const { navBarMobileOpen } = useAppSelector(
    (state: RootState) => state.global
  );
  const dispatch = useAppDispatch();

  const handleDrawerClose = () => {
    dispatch(setNavBarMobileClosing(true));
    dispatch(setNavBarMobileOpen(false));
  };

  const handleDrawerTransitionEnd = () => {
    dispatch(setNavBarMobileClosing(false));
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={navBarMobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            padding: "0 15px",
          },
        }}
      >
        <DrawerHeader className="flex justify-center">
          <Box className="rounded py-1 px-2 mx-auto select-none">
            <Typography fontWeight={700} variant="h6" color="#06175E">
              Quick Book
            </Typography>
          </Box>
        </DrawerHeader>
        <DrawerRoutes mini={true} handleDrawerClose={handleDrawerClose} />
      </Drawer>
    </Box>
  );
};

export const SideBarSm = () => {
  const { navBarDesktopMini } = useAppSelector(
    (state: RootState) => state.global
  );
  const dispatch = useAppDispatch();

  const theme = useTheme();

  const handleToggleVariant = () => {
    dispatch(setNavBarDesktopMini(!navBarDesktopMini));
  };
  return (
    <Box
      component="nav"
      sx={{
        width: { sm: navBarDesktopMini ? drawerWidth : miniWidth },
        flexShrink: { sm: 0 },
        padding: 2,
        height: "100%",
      }}
      aria-label="mailbox folders"
    >
      <Box className="w-full h-full bg-white/30 border border-white/80 rounded shadow-lg"></Box>
      <Box
        variant="permanent"
        open={navBarDesktopMini}
        sx={{
          position: "absolute",
          top: 16,
          height: "96%",
          width: navBarDesktopMini ? "86%" : "68%",
          borderRadius: 2,
          padding: 2,
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          gap: "40px",
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          "& .MuiDrawer-paper": {
            width: navBarDesktopMini ? drawerWidth : miniWidth,
            overflowX: "hidden",
            boxSizing: "border-box",
            padding: "0 15px 15px 15px",
            borderRight: "none",
          },
        }}
      >
        <DrawerHeader className="flex justify-center">
          {navBarDesktopMini ? (
            <Box
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              onClick={handleToggleVariant}
              className="cursor-pointer rounded w-[174px] py-1 px-2 mx-auto select-none flex justify-center items-center"
            >
              <Typography fontWeight={700} variant="h5">
                Quick Book
              </Typography>
            </Box>
          ) : (
            <Box
              onClick={handleToggleVariant}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              className="cursor-pointer rounded w-[36px] h-[36px] mx-auto select-none flex justify-center items-center"
            >
              <Typography fontWeight={700} variant="h5">
                QB
              </Typography>
            </Box>
          )}
        </DrawerHeader>
        <DrawerRoutes mini={navBarDesktopMini} />
      </Box>
    </Box>
  );
};

interface DrawerTypes {
  mini: boolean;
  handleDrawerClose?: () => void;
}

const DrawerRoutes: React.FC<DrawerTypes> = ({
  mini,
  handleDrawerClose,
}: DrawerTypes) => {
  const theme = useTheme();
  const pathname = usePathname();

  const handleClose = () => {
    if (handleDrawerClose) {
      handleDrawerClose();
    }
  };

  return (
    <List className="h-full flex flex-col justify-between">
      <Box>
        {dashboardRoutes?.map((section) => (
          <List
            key={section.id}
            className={`pb-0 ${section.id !== 1 && !mini && "border-t"} ${
              section.id !== 1 && "pt-5 mt-5"
            } border-[#D2D2D2]`}
          >
            {mini && section.header && (
              <Box className="relative">
                <Divider sx={{ margin: "4px auto 20px" }} />
              </Box>
            )}

            {section.routes.map(({ name, Icon, path }, idx) => {
              const selected = pathname
                ?.toLowerCase()
                .includes(name.toLowerCase());
              return (
                <Link key={idx} href={path} onClick={handleClose}>
                  <ListItem disablePadding>
                    <Tooltip
                      TransitionComponent={Zoom}
                      title={name}
                      placement="right"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            display: mini ? "none" : "block",
                            fontSize: "14px",
                            boxShadow: theme.shadows[1],
                          },
                        },
                      }}
                    >
                      <ListItemButton
                        sx={{
                          padding: "5px 8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px",
                          marginTop: idx !== 0 ? 2.5 : 0,
                          backgroundColor: selected
                            ? theme.palette.primary.main
                            : "transparent",
                          "&:hover": {
                            backgroundColor: selected
                              ? theme.palette.primary.main
                              : theme.palette.action.hover,
                          },
                          boxShadow: selected ? theme.shadows[2] : "none",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: mini ? "50px" : "40px",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Icon
                            sx={{
                              color: selected
                                ? theme.palette.common.white
                                : theme.palette.text.primary,
                            }}
                          />
                        </ListItemIcon>
                        {mini && (
                          <ListItemText
                            sx={{
                              color: selected
                                ? theme.palette.common.white
                                : theme.palette.text.primary,
                            }}
                            primary={name}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                </Link>
              );
            })}
          </List>
        ))}
      </Box>
    </List>
  );
};
