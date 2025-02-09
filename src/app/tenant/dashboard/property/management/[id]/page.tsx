import DashboardLayout from "@/features/dashboard/dashboardLayout";
import UpdatePropertyPage from "@/features/dashboard/property/update";

const UpdateProperty = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <DashboardLayout>
        <UpdatePropertyPage propertyId={params.id} />
      </DashboardLayout>
    </div>
  );
};

export default UpdateProperty;
