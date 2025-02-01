"use client";

import useCancelTransaction from "@/hooks/api/transaction/useCancelTransaction";
import useGetTransactionByUser from "@/hooks/api/transaction/useGetTransactionByUser";
import useUploadPaymentProof from "@/hooks/api/transaction/useUploadPaymentProof";
import { FC, useState } from "react";
import PriceDetailCard from "./components/PriceDetailCard";
import TransactionDetailCard from "./components/TransactionDetailCard";

interface TransactionDetailPageProps {
  transactionId: number;
}

const TransactionDetailPage: FC<TransactionDetailPageProps> = ({
  transactionId,
}) => {
  const { data, isPending } = useGetTransactionByUser(transactionId);
  const { mutate: uploadProof, isPending: isUploading } =
    useUploadPaymentProof();
  const { mutate: cancelTransaction, isPending: isCancelling } =
    useCancelTransaction();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <main className="flex justify-between px-16">
      <div className="flex w-3/5 flex-col gap-4">
        <TransactionDetailCard
          data={data}
          onUploadProof={(file) =>
            uploadProof(
              { transactionId, paymentProof: file },
              { onSuccess: () => setSelectedFile(null) },
            )
          }
          onCancelTransaction={() => cancelTransaction(transactionId)}
          isUploading={isUploading}
          isCancelling={isCancelling}
        />
      </div>

      <PriceDetailCard data={data} />
    </main>
  );
};

export default TransactionDetailPage;
