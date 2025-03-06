import LandingPageLayout from "@/components/LandingPageLayout";
import VerifyComponent from "@/features/auth/verify/index.tsx";
import React from "react";

const Verify = () => {
  return (
    <div>
      <LandingPageLayout>
        <VerifyComponent />
      </LandingPageLayout>
    </div>
  );
};

export default Verify;
