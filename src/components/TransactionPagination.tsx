"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="mt-8 flex w-full items-center justify-center">
      <Pagination>
        <PaginationContent className="flex flex-wrap items-center gap-3">
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              className="group h-10 w-10 rounded-full border-gray-200 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-5 w-5 text-gray-500 transition-colors group-hover:text-blue-600" />
            </Button>
          </PaginationItem>

          <div className="flex items-center gap-2">
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <span className="px-2 text-gray-400">•••</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    className={`group relative h-10 w-10 rounded-full text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={() =>
                      typeof page === "number" && onPageChange(page)
                    }
                    disabled={isLoading}
                  >
                    {page}
                    {currentPage === page && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-75"></span>
                    )}
                  </Button>
                )}
              </PaginationItem>
            ))}
          </div>

          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              className="group h-10 w-10 rounded-full border-gray-200 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRight className="h-5 w-5 text-gray-500 transition-colors group-hover:text-blue-600" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="ml-4 hidden text-sm text-gray-500 md:block">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default TransactionPagination;
