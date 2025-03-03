import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import RoomManagementPage from "@/features/tenant/dashboard/property/room";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const Room = () => {
  return (
    <div>
      <DashboardLayout>
        <RoomManagementPage />
      </DashboardLayout>
    </div>
  );
};

export default TenantAuthGuard(Room);
