import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import CreateRoomPage from "@/features/tenant/dashboard/property/room/create";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const CreateRoom = () => {
  return (
    <div>
      <DashboardLayout>
        <CreateRoomPage />
      </DashboardLayout>
    </div>
  );
};

export default TenantAuthGuard(CreateRoom);
