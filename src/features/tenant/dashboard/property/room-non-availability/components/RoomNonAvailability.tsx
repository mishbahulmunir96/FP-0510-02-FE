"use client";
import Pagination from "@/components/PaginationSection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDeleteRoomNonAvailability from "@/hooks/api/room-non-availability/useDeleteRoomNonAvailability";
import useRoomNonAvailabilities from "@/hooks/api/room-non-availability/useGetRoomNonAvailability";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { EditRoomNonAvailabilityButton } from "./EditRoomNonAvailability";

interface RoomNonAvailabilityPageProps {
  roomId: number;
}

const RoomNonAvailabilityList: FC<RoomNonAvailabilityPageProps> = ({
  roomId,
}) => {
  const session = useSession();
  const [page, setPage] = useState(1);
  const { data, isPending } = useRoomNonAvailabilities({
    userId: session.data?.user.id,
    take: 10,
  });

  const onPageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const {
    mutateAsync: deleteRoomNonAvailability,
    isPending: pendingRoomNonAvailability,
  } = useDeleteRoomNonAvailability();

  if (isPending) {
    return (
      <div className="w-full">
        <Skeleton className="h-[400px] w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No blocked availability periods found
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Room
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Reason
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Duration
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((roomNonAvailability) => {
                return (
                  <TableRow
                    key={roomNonAvailability.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium">
                      {roomNonAvailability.room.name}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {roomNonAvailability.reason}
                      </span>
                    </TableCell>
                    <TableCell>
                      {roomNonAvailability.startDate &&
                      roomNonAvailability.endDate
                        ? `${new Date(roomNonAvailability.startDate).toLocaleDateString()} - ${new Date(roomNonAvailability.endDate).toLocaleDateString()}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <EditRoomNonAvailabilityButton
                          id={roomNonAvailability.id}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 px-3 text-xs"
                          disabled={pendingRoomNonAvailability}
                          onClick={() =>
                            deleteRoomNonAvailability(roomNonAvailability.id)
                          }
                        >
                          {pendingRoomNonAvailability
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {data.data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-sm text-gray-500"
                  >
                    No blocked availability periods found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {data.data.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            take={data.meta.take}
            total={data.meta.total}
            page={page}
            onChangePage={(newPage: number) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
};

export default RoomNonAvailabilityList;
