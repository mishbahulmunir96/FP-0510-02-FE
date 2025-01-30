import TransactionDetailPage from "@/features/transactions/TransactionDetailPage";
import React from "react";

const TransactionDetail = ({ params }: { params: { id: string } }) => {
  return <TransactionDetailPage TransactionId={params.id} />;
};

export default TransactionDetail;
