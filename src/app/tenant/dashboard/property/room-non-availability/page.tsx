"use client";

import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import RoomNonAvailabilityPage from "@/features/tenant/dashboard/property/room-non-availability";

const RoomNonAvailability = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <DashboardLayout>
        <RoomNonAvailabilityPage roomId={params.id} />
      </DashboardLayout>
    </div>
  );
};

export default RoomNonAvailability;
