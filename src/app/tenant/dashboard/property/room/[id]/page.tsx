import DashboardLayout from "@/features/dashboard/dashboardLayout";
import UpdateRoomPage from "@/features/dashboard/property/room/update-delete";

const UpdateRoom = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <DashboardLayout>
        <UpdateRoomPage roomId={params.id} />
      </DashboardLayout>
    </div>
  );
};

export default UpdateRoom;
