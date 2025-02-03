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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <main className="flex flex-col px-4 py-8 md:flex-row md:justify-between md:px-16">
      <div className="md:hidden">
        <PriceDetailTenantCard data={data} />
      </div>

      <div className="mt-4 flex w-full flex-col gap-4 md:mt-0 md:w-3/5">
        <TransactionDetailTenantCard data={data} />
      </div>

      <div className="hidden md:block md:w-[35%]">
        <PriceDetailTenantCard data={data} />
      </div>
    </main>
  );
};

export default TransactionDetailTenantPage;
