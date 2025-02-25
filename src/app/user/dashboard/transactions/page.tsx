import LandingPageLayout from "@/components/LandingPageLayout";
import DashboardUserLayout from "@/features/user/dashboard/DashboardUserLayout";
import TransactionListPage from "@/features/user/dashboard/transactions/list";
import UserAuthGuard from "@/hoc/userAuthGuard";
import React from "react";

const TransactionList = () => {
  return (
    <DashboardUserLayout>
      <TransactionListPage />
    </DashboardUserLayout>
  );
};

export default UserAuthGuard(TransactionList);
