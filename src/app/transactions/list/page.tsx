import LandingPageLayout from "@/components/LandingPageLayout";
import TransactionListPage from "@/features/transactions/list";
import UserAuthGuard from "@/hoc/userAuthGuard";
import React from "react";

const TransactionList = () => {
  return (
    <LandingPageLayout>
      <TransactionListPage />
    </LandingPageLayout>
  );
};

export default UserAuthGuard(TransactionList);
