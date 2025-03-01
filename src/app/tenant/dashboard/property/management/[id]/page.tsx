import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import UpdatePropertyPage from "@/features/tenant/dashboard/property/update";

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
