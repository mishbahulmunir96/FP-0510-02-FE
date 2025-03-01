"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useDeleteProperty from "@/hooks/api/property/useDeleteProperty";
import { useSession } from "next-auth/react";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/PaginationSection";
import { useState } from "react";
import { useGetPropertiesTenant } from "@/hooks/api/property/useGetPropertiesTenant";
import { EditPropertyCategory } from "../../category/components/EditPropertyCategory";

const PropertyList = () => {
  const session = useSession();
  const [page, setPage] = useState(1);

  const { data, isPending } = useGetPropertiesTenant({
    take: 10,
    page,
  });

  const { mutateAsync: deleteProperty, isPending: isDeleting } =
    useDeleteProperty();

  if (isPending) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!data?.data || !data.data.length) {
    return <p className="text-center">No properties found</p>;
  }

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Property List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((property) => (
            <TableRow key={property.id}>
              <TableCell>
                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src={property.imageUrl || "/placeholder.png"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{property.title}</TableCell>
              <TableCell>{property.propertyCategory.name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    property.status === "PUBLISHED" ? "secondary" : "secondary"
                  }
                >
                  {property.status}
                </Badge>
              </TableCell>
              <TableCell>{property.location}</TableCell>
              <TableCell className="space-x-2">
                <EditPropertyCategory id={property.id} />
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => deleteProperty(property.id)}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          take={data.meta.take}
          total={data.meta.total}
          onChangePage={(newPage) => setPage(newPage)}
        />
      </div>
    </>
  );
};

export default PropertyList;
