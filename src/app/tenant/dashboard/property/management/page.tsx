import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import PropertyManagementPage from "@/features/tenant/dashboard/property/management";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const PropertyManagement = () => {
  return (
    <div>
      <DashboardLayout>
        <PropertyManagementPage />
      </DashboardLayout>
    </div>
  );
};

export default TenantAuthGuard(PropertyManagement);
