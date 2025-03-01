import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import CreatePropertyPage from "@/features/tenant/dashboard/property/create";

const CreateProperty = () => {
  return (
    <div>
      <DashboardLayout>
        <CreatePropertyPage />
      </DashboardLayout>
    </div>
  );
};

export default CreateProperty;
