import ProfilePage from "@/features/tenant/dashboard/account/setting-profile";
import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const Profile = () => {
  return (
    <div>
      <DashboardLayout>
        <ProfilePage />
      </DashboardLayout>
    </div>
  );
};

export default TenantAuthGuard(Profile);
