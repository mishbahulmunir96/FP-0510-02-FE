import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <DashboardLayout children={undefined} />
    </div>
  );
};

export default TenantAuthGuard(Dashboard);
