import DashboardLayout from "@/features/dashboard/dashboardLayout";
import TransactionListTenantPage from "@/features/dashboard/transactions";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";

const TenantTransactionsList = () => {
  return (
    <DashboardLayout>
      <TransactionListTenantPage />
    </DashboardLayout>
  );
};

export default TenantAuthGuard(TenantTransactionsList);
