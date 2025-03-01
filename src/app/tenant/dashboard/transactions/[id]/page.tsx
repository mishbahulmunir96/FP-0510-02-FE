import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import TransactionDetailTenantPage from "@/features/tenant/dashboard/transactions/TransactionDetailTenantPage";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

interface TransactionDetailTenantProps {
  params: { id: string };
}

const TransactionDetailTenant = ({ params }: TransactionDetailTenantProps) => {
  return (
    <DashboardLayout>
      <TransactionDetailTenantPage transactionId={Number(params.id)} />
    </DashboardLayout>
  );
};

export default TenantAuthGuard(TransactionDetailTenant);
