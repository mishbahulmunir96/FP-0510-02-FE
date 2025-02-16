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
import useDeleteRoomNonAvailability from '@/hooks/api/room-non-availability/useDeleteRoomNonAvailability';
import useRoomNonAvailabilities from '@/hooks/api/room-non-availability/useGetRoomNonAvailability';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { EditRoomNonAvailabilityButton } from './EditRoomNonAvailability';

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
      <div className="container max-w-7xl mx-auto">
        <Skeleton className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-slate-200" />
      </div>
    );
  }

  if (!data) {
    return (
      <h5 className="container max-w-7xl mx-auto font-semibold mb-3 text-center md:text-left">
        Room Non Availability not found
      </h5>
    );
  }
  return (
    <>
      <h5 className="container max-w-7xl mx-auto font-semibold mb-3 text-center md:text-left">
        Room Non Availability List
      </h5>
      <section className="container max-w-7xl mx-auto bg-white p-5 rounded-lg">
        <Table>
          <TableCaption>A list of your Room Non Availability</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((roomNonAvailability) => {
              return (
                <TableRow key={roomNonAvailability.id}>
                  <TableCell className="font-medium">
                    {roomNonAvailability.room.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {roomNonAvailability.reason}
                  </TableCell>
                  <TableCell className="font-medium">
                    {roomNonAvailability.startDate &&
                    roomNonAvailability.endDate
                      ? `${new Date(roomNonAvailability.startDate).toLocaleDateString()} - ${new Date(roomNonAvailability.endDate).toLocaleDateString()}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <Button
                      variant={'destructive'}
                      disabled={pendingRoomNonAvailability}
                      onClick={() =>
                        deleteRoomNonAvailability(roomNonAvailability.id)
                      }
                    >
                      {pendingRoomNonAvailability ? 'Deleting...' : 'Delete'}
                    </Button>
                    <EditRoomNonAvailabilityButton
                      id={roomNonAvailability.id}
                    />
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

export default RoomNonAvailabilityList;