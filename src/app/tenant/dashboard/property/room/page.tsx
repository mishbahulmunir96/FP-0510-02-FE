import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import RoomManagementPage from "@/features/tenant/dashboard/property/room";

const Room = () => {
  return (
    <div>
      <DashboardLayout>
        <RoomManagementPage />
      </DashboardLayout>
    </div>
  );
};

export default Room;
