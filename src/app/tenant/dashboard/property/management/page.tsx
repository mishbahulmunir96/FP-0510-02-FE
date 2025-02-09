import DashboardLayout from "@/features/dashboard/dashboardLayout";
import PropertyManagementPage from "@/features/dashboard/property/management";

const PropertyManagement = () => {
  return (
    <div>
      <DashboardLayout>
        <PropertyManagementPage />
      </DashboardLayout>
    </div>
  );
};

export default PropertyManagement;
