import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import PeakSeasonRatePage from "@/features/tenant/dashboard/property/peak-season-rate";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";
import React from "react";

const PeakSeasonRate = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <DashboardLayout>
        <PeakSeasonRatePage roomId={params.id} />;
      </DashboardLayout>
    </div>
  );
};

export default TenantAuthGuard(PeakSeasonRate);
