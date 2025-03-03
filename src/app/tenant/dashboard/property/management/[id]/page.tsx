import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import UpdatePropertyPage from "@/features/tenant/dashboard/property/update";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const UpdateProperty = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <DashboardLayout>
        <UpdatePropertyPage propertyId={params.id} />
      </DashboardLayout>
    </div>
  );
};

export default TenantAuthGuard(UpdateProperty);
