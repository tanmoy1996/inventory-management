"use client";

import { Box, Button, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useThemeContext } from "../theme/ThemeContextProvider";

export default function Login({ toggle }: any) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mode, toggleColorMode } = useThemeContext();

  const handleLogin = async (e: any) => {
    // e.preventDefault();
    const payload = {
      email,
      password,
    };

    const res = await signIn("credentials", {
      ...payload,
      redirect: false,
    });
    if (res?.ok) {
      console.log("res: ", res);
      router.refresh();
    }
  };

  return (
    <Box>
      <TextField
        type="text"
        label="email"
        onInput={({ target }: any) => setEmail(target.value)}
      />
      <TextField
        type="password"
        label="password"
        onInput={({ target }: any) => setPassword(target.value)}
      />
      <Button onClick={(e) => handleLogin(e)}>Login</Button>
      <Button onClick={() => signIn("google")}>G Login</Button>
      <Button variant="contained" onClick={toggleColorMode}>
        {mode}
      </Button>
      <Button variant="contained" color="secondary" onClick={toggleColorMode}>
        {mode}
      </Button>
      <Button variant="contained" color="error" onClick={toggleColorMode}>
        {mode}
      </Button>
      <Button variant="contained" color="info" onClick={toggleColorMode}>
        {mode}
      </Button>
      <Button variant="contained" color="warning" onClick={toggleColorMode}>
        {mode}
      </Button>
      <Button variant="contained" color="success" onClick={toggleColorMode}>
        {mode}
      </Button>
    </Box>
  );
}
