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

  // Tambahkan log untuk debugging
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

  return (
    <main className="min-h-screen items-center justify-center p-4">
      <div className="mx-auto my-[125px] max-w-7xl">
        <div className="flex items-center justify-center gap-3">
          <p>Sort by</p>
          <Select onValueChange={handleSortBy} value={sortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Name</SelectItem>
            </SelectContent>
          </Select>
          <p>Sort order</p>
          <Select onValueChange={handleSortOrder} value={sortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isPending ? (
          <div className="container mx-auto my-9 max-w-7xl gap-5 px-3 md:grid md:px-0">
            <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
            <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
            <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
          </div>
        ) : data && data.data.length === 0 ? (
          <p className="mt-[10%] text-center text-lg font-semibold">
            No properties found for your search criteria.
          </p>
        ) : (
          data?.data.map((property) => (
            <Link key={property.id} href={`/property/${property.slug}`}>
              <Card className="mt-9 grid overflow-hidden md:grid-cols-[1fr_2fr_1fr]">
                <div className="relative h-[225px] w-full overflow-hidden">
                  <Image
                    src={
                      property.propertyImage?.[0]?.imageUrl ||
                      "/placeholder.jpg"
                    }
                    alt="PropertyImage"
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="space-y-7 px-10 py-5">
                  <h3 className="text-center text-xl font-semibold md:text-left">
                    {property.title}
                  </h3>
                  <p className="line-clamp-3 text-justify">
                    {property.description}
                  </p>
                  <div className="flex justify-center gap-3 md:justify-normal">
                    <Badge>{property.propertyCategory?.name || "N/A"}</Badge>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium">
                        {property.reviews?.[0]?.rating ? (
                          <div className="flex items-center gap-1">
                            <GoStarFill className="text-[#fbae2c]" />
                            <p className="text-sm font-medium">
                              {property.reviews[0].rating}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <GoStarFill className="text-slate-200" />
                            <p className="text-sm font-medium">0</p>
                          </div>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="place-content-center border-l-2 px-10 py-5">
                  <p className="text-center">Start from</p>
                  <h3 className="text-center text-xl font-semibold text-[#396ee4]">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(property.room?.[0]?.price || 0)}
                  </h3>
                  <Button className="mt-5 w-full">Choose</Button>
                </div>
              </Card>
            </Link>
          ))
        )}
        {data && (
          <div className="container mx-auto mt-10 flex max-w-7xl justify-center">
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
        )}
      </div>
    </main>
  );
};

export default SearchPropertiesPage;
