import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200/70", className)} />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <Skeleton className="ml-auto mt-4 h-4 w-1/4" />
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-7 w-1/4" />
        <Skeleton className="h-8 w-1/6" />
      </div>
      <Skeleton className="mt-1 h-4 w-1/5" />
      <div className="mt-10 space-y-2">
        <Skeleton className="h-[250px] w-full" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Skeleton className="mb-6 h-7 w-1/4" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
};

export const StatCardsSkeletonList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export const FiltersSkeleton: React.FC = () => {
  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-[500px]" />
        <Skeleton className="h-10 w-full sm:w-[200px]" />
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full sm:w-[320px]" />
        <Skeleton className="h-10 w-full sm:w-[320px]" />
      </div>
    </div>
  );
};
