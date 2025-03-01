import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import StatisticPage from "@/features/tenant/dashboard/reports/statistics";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const Statistics = () => {
  return (
    <DashboardLayout>
      <StatisticPage />
    </DashboardLayout>
  );
};

export default TenantAuthGuard(Statistics);
