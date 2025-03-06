"use client";
import Pagination from "@/components/PaginationSection";
import RoomCard from "@/components/RoomTenantCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomsTenant } from "@/hooks/api/room/useGetRoomsTenant";
import { useSession } from "next-auth/react";
import { useState } from "react";

const RoomTenantList = () => {
  const session = useSession();
  const [page, setPage] = useState(1);
  const { data, isPending } = useGetRoomsTenant({
    page,
    take: 4,
    propertyId: session.data?.user.id,
  });

  if (isPending) {
    return (
      <div className="container mx-auto max-w-7xl grid-cols-4 gap-5 md:grid">
        <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
        <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
        <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
        <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
        <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
        <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
        <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
        <Skeleton className="relative h-[300px] w-full overflow-hidden rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <h5 className="container mx-auto mb-3 max-w-7xl text-center font-semibold md:text-left">
        Room Not Found
      </h5>
    );
  }
  return (
    <>
      <h3 className="container mx-auto mb-3 max-w-7xl text-center text-2xl font-semibold md:text-left">
        Room
      </h3>
      <section className="container mx-auto max-w-7xl grid-cols-4 gap-5 md:grid">
        {data?.data.map((room) => {
          return (
            <RoomCard
              key={room.id}
              id={room.id}
              guest={room.guest}
              imageUrl={room.roomImage?.[0]?.imageUrl}
              name={room.name || room.type}
              stock={room.stock}
              price={room.price}
              propertyTitle={room.property.title}
              type={room.type}
            />
          );
        })}
      </section>
      <div className="container mx-auto mt-10 flex max-w-7xl justify-center">
        <Pagination
          take={data.meta.take}
          total={data.meta.total}
          page={page}
          onChangePage={(newPage: number) => setPage(newPage)}
        />
      </div>
    </>
  );
};

export default RoomTenantList;
