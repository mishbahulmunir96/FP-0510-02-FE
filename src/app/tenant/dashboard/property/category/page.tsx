import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import TenantLayout from "@/features/tenant/dashboard/dashboardLayout";
import CategoryPage from "@/features/tenant/dashboard/property/category";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const PropertyCategory = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <DashboardLayout>
        <CategoryPage propertyCategoryId={params.id} />;
      </DashboardLayout>
    </div>
  );
};

export default TenantAuthGuard(PropertyCategory);
