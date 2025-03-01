'use client';
import Pagination from '@/components/PaginationSection';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { EditPeakSeasonButton } from './EditPeakSeasonRate';
import { useGetPeakSeasons } from '@/hooks/api/peak-season-rate/useGetPeakSeasonRate';
import { useDeletePeakSeasonRate } from '@/hooks/api/peak-season-rate/useDeletePeakSeasonRate';

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

  const onPageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const { mutateAsync: deletePeakSeason, isPending: pendingPeakSeason } =
    useDeletePeakSeasonRate();

  if (isPending) {
    return (
      <div className="container max-w-7xl mx-auto">
        <Skeleton className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-slate-200" />
      </div>
    );
  }

  if (!data) {
    return (
      <h5 className="container max-w-7xl mx-auto font-semibold mb-3 text-center md:text-left">
        Peak Season not found
      </h5>
    );
  }
  return (
    <>
      <h5 className="container max-w-7xl mx-auto font-semibold mb-3 text-center md:text-left">
        Peak Seasons Rate List
      </h5>
      <section className="container max-w-7xl mx-auto bg-white p-5 rounded-lg">
        <Table>
          <TableCaption>A list of your Peak Seasons Rate</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((peakSeasons) => {
              return (
                <TableRow key={peakSeasons.id}>
                  <TableCell className="font-medium">
                    {peakSeasons.room.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(peakSeasons.price)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {peakSeasons.startDate && peakSeasons.endDate
                      ? `${new Date(peakSeasons.startDate).toLocaleDateString()} - ${new Date(peakSeasons.endDate).toLocaleDateString()}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <Button
                      variant={'destructive'}
                      disabled={pendingPeakSeason}
                      onClick={() => deletePeakSeason(peakSeasons.id)}
                    >
                      {pendingPeakSeason ? 'Deleting...' : 'Delete'}
                    </Button>
                    <EditPeakSeasonButton id={peakSeasons.id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
      <div className="container max-w-7xl mx-auto flex justify-center mt-10">
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

export default PeakSeasonsRateList;