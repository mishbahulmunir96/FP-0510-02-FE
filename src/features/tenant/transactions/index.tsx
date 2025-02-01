"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TransactionFilters from "@/features/transactions/list/component/TransactionFilter";
import TransactionListSkeleton from "@/features/transactions/list/component/TransactionListSkeleton";
import TransactionPagination from "@/features/transactions/list/component/TransactionPagination";
import useGetTransactionsByTenant from "@/hooks/api/transaction/useGetTransactionsByTenant";
import { createParser, useQueryStates } from "nuqs";
import { useState } from "react";
import TransactionListTenantCard from "./components/TransactionListTenantCard";

type SortOrder = "asc" | "desc";

interface Filters {
  sortBy: string;
  sortOrder: SortOrder;
  startDate?: Date;
  endDate?: Date;
}

const numberParser = createParser({
  parse: (value: string) => parseInt(value, 10),
  serialize: (value: number) => value.toString(),
});

const dateParser = createParser({
  parse: (value: string) => value,
  serialize: (value: string) => value,
});

const TransactionListTenantPage = () => {
  const [take] = useState(10);

  const [queryStates, setQueryStates] = useQueryStates({
    page: numberParser.withDefault(1),
    sortBy: createParser({
      parse: String,
      serialize: String,
    }).withDefault("createdAt"),
    sortOrder: createParser({
      parse: (value: string) => value as SortOrder,
      serialize: String,
    }).withDefault("desc" as const),
    startDate: dateParser.withDefault(""),
    endDate: dateParser.withDefault(""),
  });

  const { page, sortBy, sortOrder, startDate, endDate } = queryStates;

  const filters: Filters = {
    sortBy,
    sortOrder: sortOrder as SortOrder,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  };

  const {
    data: transactionsResponse,
    isLoading,
    error,
    isError,
    isFetching,
  } = useGetTransactionsByTenant(page, take, filters);

  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground">{error?.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const handleFilterChange = (newFilters: Filters) => {
    setQueryStates({
      sortBy: newFilters.sortBy,
      sortOrder: newFilters.sortOrder,
      startDate: newFilters.startDate?.toISOString() ?? "",
      endDate: newFilters.endDate?.toISOString() ?? "",
      page: 1,
    });
  };

  const totalPages = Math.ceil((transactionsResponse?.meta?.total || 0) / take);

  const handlePageChange = (newPage: number) => {
    setQueryStates({ ...queryStates, page: newPage });
  };

  const transactions = transactionsResponse?.data ?? [];

  return (
    <main className="mb-8 space-y-6 px-20">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Property Transactions
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage all transactions for your properties
            </p>
          </div>
        </div>
        <Separator />
      </div>

      <TransactionFilters
        initialFilters={filters}
        onFilterChange={handleFilterChange}
      />

      {transactions.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-semibold">No transactions found</h2>
          <p className="text-muted-foreground">
            There are no transactions for your properties yet.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionListTenantCard
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>

          <TransactionPagination
            currentPage={page}
            totalPages={totalPages}
            isLoading={isFetching}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
};

export default TransactionListTenantPage;
