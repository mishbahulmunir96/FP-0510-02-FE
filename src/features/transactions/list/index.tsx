"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import useGetTransactionByUser from "@/hooks/api/transaction/useGetTransactionsByUser";
import { Transaction } from "@/types/transaction";
import { signIn, useSession } from "next-auth/react";
import { createParser, useQueryStates } from "nuqs";
import { useState } from "react";
import TransactionFilters from "./component/TransactionFilter";
import TransactionListCard from "./component/TransactionListCard";
import TransactionListSkeleton from "./component/TransactionListSkeleton";

interface TransactionResponse {
  data: Transaction[];
  meta: {
    total: number;
    totalCount: number;
    page: number;
    take: number;
  };
}

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

const TransactionListPage = () => {
  const { data: session, status } = useSession();
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
  } = useGetTransactionByUser(session?.user?.id as number, page, take, filters);

  if (status === "loading" || isLoading) {
    return <TransactionListSkeleton />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold">
          Please login to view transactions
        </h2>
        <Button onClick={() => signIn()}>Login</Button>
      </div>
    );
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

  const transactions: Transaction[] = transactionsResponse?.data ?? [];

  return (
    <main className="space-y-6 px-20">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Transaction History
            </h1>
            <p className="text-muted-foreground">
              Manage and track all your transactions in one place
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
            You haven't made any transactions yet.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {transactions.map((transaction: Transaction) => (
              <TransactionListCard
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1 || isFetching}
                  >
                    Previous
                  </Button>
                </PaginationItem>

                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index + 1}>
                    <Button
                      variant={page === index + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(index + 1)}
                      disabled={isFetching}
                    >
                      {index + 1}
                    </Button>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, page + 1))
                    }
                    disabled={page === totalPages || isFetching}
                  >
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </main>
  );
};

export default TransactionListPage;
