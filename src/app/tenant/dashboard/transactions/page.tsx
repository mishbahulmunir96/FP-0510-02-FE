import DashboardLayout from "@/features/tenant/dashboard/dashboardLayout";
import TransactionListTenantPage from "@/features/tenant/dashboard/transactions";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const TenantTransactionsList = () => {
  return (
    <DashboardLayout>
      <TransactionListTenantPage />
    </DashboardLayout>
  );
};

export default TenantAuthGuard(TenantTransactionsList);
