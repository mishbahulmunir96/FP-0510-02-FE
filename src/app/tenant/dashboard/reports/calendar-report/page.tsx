import CalendarReportPage from "@/features/tenant/dashboard/reports/calendar-report/index.tsx";
import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const CalendarReport = () => {
  return (
    <DashboardLayout>
      <CalendarReportPage />
    </DashboardLayout>
  );
};

export default TenantAuthGuard(CalendarReport);
