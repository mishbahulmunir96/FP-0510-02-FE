
import LoginPage from "@/features/auth/login";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const Login = async () => {
  const session = await auth();
  if (session) return redirect("/");
  return <LoginPage />;
};

export default Login;

