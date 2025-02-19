"use client";
import { FC } from "react";
import PriceDetailTenantCard from "./components/PriceDetailTenantCard";
import TransactionDetailTenantCard from "./components/TransactionDetailTenantCard";
import useGetTransactionByTenant from "@/hooks/api/transaction/useGetTransactionByTenant";

interface TransactionDetailTenantPageProps {
  transactionId: number;
}

const TransactionDetailTenantPage: FC<TransactionDetailTenantPageProps> = ({
  transactionId,
}) => {
  const { data, isPending } = useGetTransactionByTenant(transactionId);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-gray-500">
            Loading transaction details...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Transaction Details
          </h1>
          <p className="text-sm text-gray-600">
            Review booking information and manage customer requests
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <TransactionDetailTenantCard data={data} />
          </div>

          <div className="w-full md:w-1/3">
            <div className="sticky top-6">
              <PriceDetailTenantCard data={data} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionDetailTenantPage;
