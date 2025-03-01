import FormInput from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useUpdateRoomNonAvailability from '@/hooks/api/room-non-availability/useUpdateRoomNonAvailability';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { RoomNonAvailabilitySchema } from '../schemas/RoomNonAvailabilitySchema';
import useRoomNonAvailabilities from '@/hooks/api/room-non-availability/useGetRoomNonAvailability';

interface RoomNonAvailabilityButton {
  id: number;
}

export const EditRoomNonAvailabilityButton: FC<RoomNonAvailabilityButton> = ({
  id,
}) => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: updateRoomNonAvailability, isPending: pendingUpdate } =
    useUpdateRoomNonAvailability();
  const { data, isPending } = useRoomNonAvailabilities({
    userId: session.data?.user.id,
    take: 10,
  });
  const formik = useFormik({
    initialValues: {
      id,
      reason: '',
    },
    validationSchema: RoomNonAvailabilitySchema,
    onSubmit: async (values) => {
      const dataToSubmit = {
        ...values,
      };
      await updateRoomNonAvailability(dataToSubmit);
      setIsOpen(false);
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Room Non Availability</DialogTitle>
            <DialogDescription>
              Make changes to your Room Non Availability here. Click save when
              youre done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <FormInput
                name="reason"
                label="Reason"
                type="text"
                placeholder="Reason of Room Non Availability"
                value={formik.values.reason}
                isError={!!formik.touched.reason && !!formik.errors.reason}
                error={formik.errors.reason}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pendingUpdate}>
              {pendingUpdate ? 'Updating...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};