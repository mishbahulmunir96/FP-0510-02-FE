"use client";
import LandingPageLayout from "@/components/LandingPageLayout";
import TransactionListTenantPage from "@/features/tenant/transactions";
import TenantAuthGuard from "@/hoc/tenantAuthGuard";
import React from "react";

const TenantTransactionsList = () => {
  return (
    <LandingPageLayout>
      <TransactionListTenantPage />
    </LandingPageLayout>
  );
};

export default TenantAuthGuard(TenantTransactionsList);
