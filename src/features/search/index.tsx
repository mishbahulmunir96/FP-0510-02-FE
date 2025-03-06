"use client";

import Pagination from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPropertiesByQuery } from "@/hooks/api/search-property/useGetPropertiesByQuery";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GoStarFill } from "react-icons/go";
import { TbSortAscending, TbSortDescending } from "react-icons/tb";
import { IoArrowForward } from "react-icons/io5";

const SearchPropertiesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const title = searchParams.get("title") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const guest = Number(searchParams.get("guest")) || 0;

  useEffect(() => {
    console.log("Search params:", {
      title,
      startDate,
      endDate,
      guest,
      sortBy,
      sortOrder,
      page,
    });
  }, [title, startDate, endDate, guest, sortBy, sortOrder, page]);

  const { data, isPending, refetch } = useGetPropertiesByQuery({
    take: 10,
    page,
    sortBy,
    sortOrder,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    guest,
    title,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    refetch();
  }, [sortBy, sortOrder, searchParams, page, refetch]);

  const handleSortBy = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handleSortOrder = (value: "asc" | "desc") => {
    setSortOrder(value);
    setPage(1);
  };

  const exploreCatalog = () => {
    router.push("/property-catalog");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {title ? `Search results for "${title}"` : "All Properties"}
            </h1>
            <p className="mt-2 text-gray-600">
              {data?.meta.total} properties found
              {startDate && endDate
                ? ` from ${new Date(startDate).toLocaleDateString()} to ${new Date(
                    endDate,
                  ).toLocaleDateString()}`
                : ""}
              {guest > 0 ? ` for ${guest} guest${guest > 1 ? "s" : ""}` : ""}
            </p>
          </div>
        </div>
        <div className="mb-6 flex justify-end rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <Select onValueChange={handleSortBy} value={sortBy}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Name</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                handleSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
              className="h-10 w-10"
            >
              {sortOrder === "asc" ? (
                <TbSortAscending className="h-5 w-5" />
              ) : (
                <TbSortDescending className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {isPending ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          ) : data && data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16 text-center shadow-sm">
              <h3 className="text-xl font-medium text-gray-900">
                No properties found
              </h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your search criteria to find more options.
              </p>
              <Button
                onClick={exploreCatalog}
                className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Browse All Properties
                <IoArrowForward className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            data?.data.map((property) => (
              <Link key={property.id} href={`/property/${property.slug}`}>
                <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-md">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-60 w-full shrink-0 overflow-hidden md:h-auto md:w-1/3">
                      <Image
                        src={
                          property.propertyImage?.[0]?.imageUrl ||
                          "/placeholder.jpg"
                        }
                        alt={property.title}
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {property.propertyCategory?.name && (
                        <div className="absolute left-4 top-4">
                          <Badge className="bg-white/90 px-3 py-1 text-sm font-medium text-gray-800 backdrop-blur-sm">
                            {property.propertyCategory.name}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1">
                          <GoStarFill
                            className={
                              property.reviews?.[0]?.rating
                                ? "text-amber-400"
                                : "text-gray-200"
                            }
                          />
                          <span className="font-medium">
                            {property.reviews?.[0]?.rating || "0"}
                          </span>
                        </div>
                      </div>

                      <p className="mb-4 line-clamp-3 flex-grow text-gray-600">
                        {property.description}
                      </p>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            Starting from
                          </span>
                          <span className="text-xl font-semibold text-blue-600">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(property.room?.[0]?.price || 0)}
                            <span className="text-sm font-normal text-gray-500">
                              {" "}
                              / night
                            </span>
                          </span>
                        </div>
                        <Button className="bg-blue-600 transition-colors hover:bg-blue-700">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>

        <div className="mt-10">
          {data && data.meta.total > data.meta.take && (
            <div className="flex justify-center">
              <Pagination
                page={page}
                take={data.meta.take}
                total={data.meta.total}
                onChangePage={handlePageChange}
              />
            </div>
          )}

          {data && data.data.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={exploreCatalog}
                variant="outline"
                className="flex items-center gap-2 px-6 py-2 text-blue-600 hover:bg-blue-50"
              >
                Explore More Properties
                <IoArrowForward className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPropertiesPage;
