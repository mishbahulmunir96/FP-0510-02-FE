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
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Booking Details
          </h1>
          <p className="text-sm text-gray-600">
            Review your booking information and payment status
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-2/3">
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

          <div className="w-full lg:w-1/3">
            <div className="sticky top-6">
              <PriceDetailCard data={data} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionDetailPage;
