"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TransactionFilters from "@/components/TransactionFilter";
import TransactionListSkeleton from "@/features/user/dashboard/transactions/list/component/TransactionListSkeleton";
import TransactionPagination from "@/components/TransactionPagination";
import useGetTransactionsByTenant from "@/hooks/api/transaction/useGetTransactionsByTenant";
import { createParser, useQueryStates } from "nuqs";
import { useState } from "react";
import TransactionListTenantCard from "./components/TransactionListTenantCard";
import { Filters, SortOrder } from "@/types/transaction";
import { ArrowDownUp, Calendar, Filter } from "lucide-react";

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
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

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
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                Property Transactions
              </h1>
              <p className="mt-2 text-gray-600">
                Track and manage your property transactions efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="group flex items-center gap-2 rounded-xl border-gray-200"
              >
                <Filter className="h-4 w-4 text-gray-500 transition-colors group-hover:text-blue-600" />
                {isFilterExpanded ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>

          {isFilterExpanded && (
            <>
              <Separator className="my-6" />
              <TransactionFilters
                initialFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </>
          )}
        </div>

        {isLoading ? (
          <TransactionListSkeleton />
        ) : isError ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="rounded-full bg-red-50 p-3">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-center text-gray-600">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred"}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-2 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="rounded-full bg-gray-50 p-3">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              No transactions found
            </h2>
            <p className="text-center text-gray-600">
              There are no transactions matching your current filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {transactions.length} of{" "}
                {transactionsResponse?.meta?.total} transactions
              </p>
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Sorted by{" "}
                  {sortBy === "createdAt"
                    ? "booking date"
                    : sortBy === "totalPrice"
                      ? "total price"
                      : sortBy}
                </span>
              </div>
            </div>

            <div className="grid gap-4">
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
              onPageChange={(newPage) =>
                setQueryStates({ ...queryStates, page: newPage })
              }
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default TransactionListTenantPage;
