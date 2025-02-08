import DashboardLayout from "@/features/dashboard/dashboardLayout";
import TenantLayout from "@/features/dashboard/dashboardLayout";
import CategoryPage from "@/features/dashboard/property/category";

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
