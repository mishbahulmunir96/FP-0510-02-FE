import DashboardLayout from "@/features/dashboard/dashboardLayout";
import StatisticPage from "@/features/dashboard/statistics";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const Statistics = () => {
  return (
    <DashboardLayout>
      <StatisticPage />
    </DashboardLayout>
  );
};

export default TenantAuthGuard(Statistics);
