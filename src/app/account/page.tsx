import LandingPageLayout from "@/components/LandingPageLayout";
import ProfilePage from "@/features/account";
import ProfileSettingsPage from "@/features/account";
import React from "react";

const Profile = () => {
  return (
    <div>
      <LandingPageLayout>
        <ProfilePage />
      </LandingPageLayout>
    </div>
  );
};

export default Profile;
