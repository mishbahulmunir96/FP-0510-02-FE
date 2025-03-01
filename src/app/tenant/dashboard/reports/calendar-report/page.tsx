import CalendarReportPage from "@/features/tenant/dashboard/reports/calendar-report/index.tsx";
import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RateHaven Property | Calendar Report",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};
const CalendarReport = () => {
  return (
    <DashboardLayout>
      <CalendarReportPage />
    </DashboardLayout>
  );
};

export default TenantAuthGuard(CalendarReport);
