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
import { useDeletePeakSeasonRate } from "@/hooks/api/peak-season-rate/useDeletePeakSeasonRate";
import { useGetPeakSeasons } from "@/hooks/api/peak-season-rate/useGetPeakSeasonRate";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { EditPeakSeasonButton } from "./EditPeakSeasonRate";

interface PeakSeasonsPageProps {
  roomId: number;
}

const PeakSeasonsRateList: FC<PeakSeasonsPageProps> = ({ roomId }) => {
  const session = useSession();
  const [page, setPage] = useState(1);
  const { data, isPending } = useGetPeakSeasons({
    userId: session.data?.user.id,
    take: 10,
  });


  const { mutateAsync: deletePeakSeason, isPending: pendingPeakSeason } =
    useDeletePeakSeasonRate();

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
          No peak season rates found
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
                  Price
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
              {data?.data.map((peakSeasons) => {
                return (
                  <TableRow
                    key={peakSeasons.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium">
                      {peakSeasons.room.name}
                      {peakSeasons.room.type}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(peakSeasons.price)}
                    </TableCell>
                    <TableCell>
                      {peakSeasons.startDate && peakSeasons.endDate
                        ? `${new Date(peakSeasons.startDate).toLocaleDateString()} - ${new Date(peakSeasons.endDate).toLocaleDateString()}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <EditPeakSeasonButton id={peakSeasons.id} />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 px-3 text-xs"
                          disabled={pendingPeakSeason}
                          onClick={() => deletePeakSeason(peakSeasons.id)}
                        >
                          {pendingPeakSeason ? "Deleting..." : "Delete"}
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
                    No peak season rates found
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

export default PeakSeasonsRateList;
