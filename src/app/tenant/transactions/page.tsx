import Transaction from "@/app/transactions/page";
import LandingPageLayout from "@/components/LandingPageLayout";
import TransactionListTenantPage from "@/features/tenant/transactions";
import React from "react";

const TenantTransactionsList = () => {
  return (
    <LandingPageLayout>
      <TransactionListTenantPage />
    </LandingPageLayout>
  );
};

export default TenantTransactionsList;
