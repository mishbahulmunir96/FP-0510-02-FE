import ForgotPasswordComponent from "@/features/auth/forgot-password";
import UserAuthGuard from "@/hoc/userAuthGuard";
import React from "react";

const ForgotPassword = () => {
  return <ForgotPasswordComponent />;
};

export default UserAuthGuard(ForgotPassword);
