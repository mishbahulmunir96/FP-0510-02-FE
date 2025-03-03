import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import CreatePropertyPage from "@/features/tenant/dashboard/property/create";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const CreateProperty = () => {
  return (
    <div>
      <DashboardLayout>
        <CreatePropertyPage />
      </DashboardLayout>
    </div>
  );
};

export default TenantAuthGuard(CreateProperty);
