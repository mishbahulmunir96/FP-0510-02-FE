import { useSession } from "next-auth/react";
import React, { FC } from "react";

interface TransactionDetailPageProps {
  TransactionId: string;
}

const TransactionDetailPage: FC<TransactionDetailPageProps> = ({
  TransactionId,
}) => {
  const session = useSession();

  return <div>TransactionDetailPage</div>;
};

export default TransactionDetailPage;
