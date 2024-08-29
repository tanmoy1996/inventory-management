"use client";

import { Box, Button, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    </Box>
  );
}
