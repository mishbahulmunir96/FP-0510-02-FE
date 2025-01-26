// app/register/page.tsx
"use client";

import UserRegisterComponent from "@/features/auth/register";
import TenantRegistrationComponent from "@/features/auth/register/tenantRegister";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role")?.toUpperCase() || "USER";

  return (
    <div className="flex flex-col justify-center p-8">
      {role === "TENANT" ? (
        <TenantRegistrationComponent />
      ) : (
        <UserRegisterComponent role={"USER"} />
      )}
    </div>
  );
}
