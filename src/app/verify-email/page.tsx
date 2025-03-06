import LandingPageLayout from "@/components/LandingPageLayout";
import VerifyEmailPage from "@/features/account/verify-email";
import React from "react";

const VerifyEmail = () => {
  return (
    <div>
      <LandingPageLayout>
        <VerifyEmailPage />
      </LandingPageLayout>
    </div>
  );
};

export default VerifyEmail;
