"use client";
import { decrement, increment } from "@/lib/features/counterSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  const dispatch = useAppDispatch();
  const { value: counter } = useAppSelector((state) => state.counter);
  const inc = () => {
    dispatch(increment());
  };
  const dec = () => {
    dispatch(decrement());
  };
  return (
    <>
      <div className="">{session?.data?.user?.name}</div>
      <button onClick={() => signOut()}>Logout</button>
      <div className="">
        <button onClick={inc}>Inc</button>
        <p>{counter}</p>
        <button onClick={dec}>Dec</button>
      </div>
    </>
  );
}
