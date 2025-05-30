"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDeleteCategory from "@/hooks/api/category/useDeleteCategory";
import useGetCategory from "@/hooks/api/category/useGetCategory";
import useUpdateCategory from "@/hooks/api/category/useUpdateCategory";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { EditPropertyCategory } from "./EditPropertyCategory";
interface PropertyCategoryPageProps {
  propertyCategoryId: number;
}

const PropertyCategoryList: FC<PropertyCategoryPageProps> = ({
  propertyCategoryId,
}) => {
  const session = useSession();
  const { data, isPending } = useGetCategory({
    userId: session.data?.user.id,
    take: 7,
  });

  const { mutateAsync: deleteCategory, isPending: pendingDelete } =
    useDeleteCategory();
  useUpdateCategory();

  if (isPending) {
    return (
      <div className="container mx-auto max-w-7xl">
        <Skeleton className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (!data) {
    return (
      <h5 className="container mx-auto mb-3 max-w-7xl text-center font-semibold md:text-left">
        Category Not Found
      </h5>
    );
  }
  return (
    <>
      <h5 className="container mx-auto mb-3 max-w-7xl text-center font-semibold md:text-left">
        Category List
      </h5>
      <section className="container mx-auto max-w-7xl rounded-lg bg-white p-5">
        <Table>
          <TableCaption>A list of your property category</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((category) => {
              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="flex items-center gap-3">
                    <Button
                      variant={"destructive"}
                      disabled={pendingDelete}
                      onClick={() => deleteCategory(category.id)}
                    >
                      {pendingDelete ? "Deleting..." : "Delete"}
                    </Button>
                    <EditPropertyCategory id={category.id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default PropertyCategoryList;
