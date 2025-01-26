"use client";
import { useEffect } from "react";

export default function Home() {
  // dummy token, karena belum ada login
  useEffect(() => {
    const dummyToken = "abcdefghijklmnopqrstuvwxyz";
    localStorage.setItem("token", dummyToken);
  }, []);
  return <div>Homepage</div>;
}
