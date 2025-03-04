import ProfilePage from "@/features/account/Setting-profile";
import DashboardUserLayout from "@/features/user/dashboard/DashboardUserLayout";
import UserAuthGuard from "@/hoc/userAuthGuard";

const Profile = () => {
  return (
    <div>
      <DashboardUserLayout>
        <ProfilePage />
      </DashboardUserLayout>
    </div>
  );
};

export default UserAuthGuard(Profile);
