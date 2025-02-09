import LandingPageLayout from "@/components/LandingPageLayout";
import TransactionListTenantPage from "@/features/tenant/transactions";

const TenantTransactionsList = () => {
  return (
    <LandingPageLayout>
      <TransactionListTenantPage />
    </LandingPageLayout>
  );
};

export default TenantTransactionsList;
