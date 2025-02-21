import LandingPageLayout from "@/components/LandingPageLayout";
import TransactionDetailPage from "@/features/transactions/TransactionDetailPage";
import UserAuthGuard from "@/hoc/userAuthGuard";
import React from "react";

const TransactionDetail = ({ params }: { params: { id: string } }) => {
  return (
    <LandingPageLayout>
      <TransactionDetailPage transactionId={Number(params.id)} />
    </LandingPageLayout>
  );
};

export default UserAuthGuard(TransactionDetail);
