import LandingPageLayout from "@/components/LandingPageLayout";
import TransactionDetailTenantPage from "@/features/tenant/transactions/TransactionDetailTenantPage";
import React from "react";

interface TransactionDetailTenantProps {
  params: { id: string };
}

const TransactionDetailTenant = ({ params }: TransactionDetailTenantProps) => {
  return (
    <LandingPageLayout>
      <TransactionDetailTenantPage transactionId={Number(params.id)} />
    </LandingPageLayout>
  );
};

export default TransactionDetailTenant;
