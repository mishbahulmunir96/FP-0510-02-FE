"use client";

import { useSearchParams } from "next/navigation";
import VerifyForm from "./components/VerifyForm";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <div>Invalid verification link</div>;
  }

  return (
    <div className="container mx-auto mt-10 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Set Your Password</h1>
      <VerifyForm token={token} />
    </div>
  );
}
