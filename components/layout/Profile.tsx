import React, { FC, useState, MouseEvent } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@/components/shared/Menu";
// import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const profileRoutes: any[] = [
  // {
  //   id: 1,
  //   path: `profile`,
  //   name: "Profile",
  //   Icon: Person2OutlinedIcon,
  // },
  // {
  //   id: 2,
  //   path: `settings`,
  //   name: 'Settings',
  //   Icon: SettingsOutlinedIcon,
  // },
];

const Profile: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const session = useSession();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const redirect = (path: string) => {
    router.push(path);
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar
        alt="User Avatar"
        src="/avatar/1.png"
        onClick={handleOpenMenu}
        className="cursor-pointer"
      />
      <Menu anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
        <Box className="w-[240px]">
          <Box className="pt-4 pb-2 px-4 flex gap-2 bg-white">
            <Avatar
              alt="User Avatar"
              src="/avatar/1.png"
              className="cursor-pointer"
            />
            <Box>
              <Typography fontWeight={700} variant="body1" color="#06175E">
                {session?.data?.user?.name}
              </Typography>
              <Typography variant="caption" color="#cacaca">
                {session?.data?.user?.email}
              </Typography>
            </Box>
          </Box>
          <Divider />

          <List sx={{ padding: "8px 8px 0px" }}>
            {profileRoutes.map(({ name, Icon, path, id }) => (
              <ListItem
                key={id}
                disablePadding
                onClick={() => {
                  redirect(`${path}`);
                }}
              >
                <ListItemButton
                  sx={{
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",

                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <Icon sx={{ color: theme.palette.text.primary }} />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      color: theme.palette.text.primary,
                    }}
                    primary={name}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="error"
            sx={{
              margin: "8px",
              width: "calc(100% - 16px)",
              borderRadius: "4px",
            }}
            onClick={signOut}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default Profile;
