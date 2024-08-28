"use client";

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
    <div>
      <input
        type="text"
        onInput={({ target }: any) => setEmail(target.value)}
      />
      <input
        type="password"
        onInput={({ target }: any) => setPassword(target.value)}
      />
      <button onClick={(e) => handleLogin(e)}>Login</button>;
      <button onClick={() => signIn("google")}>G Login</button>;
    </div>
  );
}
