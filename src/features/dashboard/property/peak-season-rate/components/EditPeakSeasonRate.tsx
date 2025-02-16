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

import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { PeakSeasonRateSchema } from '../schemas/PeakSeasonRateSchema';
import { useUpdatePeakSeasonRate } from '@/hooks/api/peak-season-rate/useUpdatePeakSeasonRate';
import { useGetPeakSeasons } from '@/hooks/api/peak-season-rate/useGetPeakSeasonRate';

interface EditPeakSeasonButton {
  id: number;
}

export const EditPeakSeasonButton: FC<EditPeakSeasonButton> = ({ id }) => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: updateCategory, isPending: pendingUpdate } =
    useUpdatePeakSeasonRate();
  const { data, isPending } = useGetPeakSeasons({
    userId: session.data?.user.id,
    take: 10,
  });
  const formik = useFormik({
    initialValues: {
      id,
      price: 0,
    },
    validationSchema: PeakSeasonRateSchema,
    onSubmit: async (values) => {
      const dataToSubmit = {
        ...values,
        price: Number(values.price),
      };
      await updateCategory(dataToSubmit);
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
            <DialogTitle>Edit Peak Season Rate</DialogTitle>
            <DialogDescription>
              Make changes to your Peak Season Rate here. Click save when youre
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <FormInput
                name="price"
                label="Price"
                type="number"
                placeholder="Price for Peak Season"
                value={formik.values.price}
                isError={!!formik.touched.price && !!formik.errors.price}
                error={formik.errors.price}
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