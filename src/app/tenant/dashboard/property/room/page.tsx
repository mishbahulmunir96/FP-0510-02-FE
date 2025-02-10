import DashboardLayout from "@/features/dashboard/dashboardLayout";
import RoomManagementPage from "@/features/dashboard/property/room";

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
