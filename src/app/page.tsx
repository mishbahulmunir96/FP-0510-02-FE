"use client";
import { useEffect } from "react";
import LandingPageLayout from "@/components/LandingPageLayout";
import HomeComponent from "@/features/home";

export default function Home() {
  // dummy token, karena belum ada login
  useEffect(() => {
    const dummyToken = "abcdefghijklmnopqrstuvwxyz";
    localStorage.setItem("token", dummyToken);
  }, []);
  return (
    <LandingPageLayout>
      <HomeComponent />
    </LandingPageLayout>
  );
}
