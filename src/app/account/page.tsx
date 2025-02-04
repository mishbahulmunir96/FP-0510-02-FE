import LandingPageLayout from "@/components/LandingPageLayout";
import ProfilePage from "@/features/account/Setting-profile";
import ProfileSettingsPage from "@/features/account/Setting-profile";
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
