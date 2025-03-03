import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import UpdateRoomPage from "@/features/tenant/dashboard/property/room/update-delete";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const UpdateRoom = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <DashboardLayout>
        <UpdateRoomPage roomId={params.id} />
      </DashboardLayout>
    </div>
  );
};

export default TenantAuthGuard(UpdateRoom);
