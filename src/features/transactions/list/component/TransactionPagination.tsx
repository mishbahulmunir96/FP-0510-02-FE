"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const TransactionPagination = ({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: TransactionPaginationProps) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
        </PaginationItem>

        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index + 1}>
            <Button
              variant={currentPage === index + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(index + 1)}
              disabled={isLoading}
            >
              {index + 1}
            </Button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TransactionPagination;
