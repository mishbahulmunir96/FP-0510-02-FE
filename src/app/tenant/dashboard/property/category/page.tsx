import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import TenantLayout from "@/features/tenant/dashboard/dashboardLayout";
import CategoryPage from "@/features/tenant/dashboard/property/category";

const PropertyCategory = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <DashboardLayout>
        <CategoryPage propertyCategoryId={params.id} />;
      </DashboardLayout>
    </div>
  );
};

export default PropertyCategory;
