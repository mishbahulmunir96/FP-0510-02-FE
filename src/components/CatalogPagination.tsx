"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FC } from "react";

interface PaginationSectionProps {
  page: number;
  take: number;
  totalCount: number;
  onChangePage: (page: number) => void;
}

const CatalogPagination: FC<PaginationSectionProps> = ({
  page,
  take,
  totalCount,
  onChangePage,
}) => {
  const totalPages = Math.ceil(totalCount / take);

  const handlePrev = () => {
    if (page > 1) {
      onChangePage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onChangePage(page + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mb-12 mt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrev}
            className={
              page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>

        {totalPages <= 7 ? (
          [...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => onChangePage(i + 1)}
                isActive={page === i + 1}
                className="cursor-pointer"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))
        ) : (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => onChangePage(1)}
                isActive={page === 1}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>

            {page > 3 && (
              <PaginationItem>
                <PaginationLink className="cursor-default">...</PaginationLink>
              </PaginationItem>
            )}

            {[...Array(3)]
              .map((_, i) => {
                const pageNum = Math.max(2, page - 1) + i;
                if (pageNum > 1 && pageNum < totalPages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => onChangePage(pageNum)}
                        isActive={page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })
              .filter(Boolean)}

            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationLink className="cursor-default">...</PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                onClick={() => onChangePage(totalPages)}
                isActive={page === totalPages}
                className="cursor-pointer"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              page >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CatalogPagination;
