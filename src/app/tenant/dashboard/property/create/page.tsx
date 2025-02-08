import DashboardLayout from "@/features/dashboard/dashboardLayout";
import CreatePropertyPage from "@/features/dashboard/property/create";

const CreateProperty = () => {
  return (
    <div>
      <DashboardLayout>
        <CreatePropertyPage />;
      </DashboardLayout>
    </div>
  );
};

export default CreateProperty;
