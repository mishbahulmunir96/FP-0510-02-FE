"use client";

import Pagination from "@/components/PaginationSection";
import PropertyTenantCard from "@/components/PropertyTenantCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPropertiesTenant } from "@/hooks/api/property/useGetPropertiesTenant";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

const PropertyTenantList = () => {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const { data, isPending, error } = useGetPropertiesTenant({
    page,
    take: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load properties. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl py-8">
        <div className="text-center">
          <h5 className="text-lg font-medium text-gray-600">
            No properties found
          </h5>
          <p className="mt-2 text-gray-500">
            Start by creating your first property
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Your Properties</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.data.map((property) => (
          <PropertyTenantCard
            key={property.id}
            id={property.id}
            imageUrl={property.propertyImage[0]?.imageUrl || ""}
            title={property.title}
            rating={property.review[0]?.rating || 0}
          />
        ))}
      </div>

      {data.meta.total > data.meta.take && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            take={data.meta.take}
            total={data.meta.total}
            onChangePage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PropertyTenantList;
