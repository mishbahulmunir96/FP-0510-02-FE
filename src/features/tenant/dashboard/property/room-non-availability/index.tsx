"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import useCreateRoomNonAvailability from "@/hooks/api/room-non-availability/useCreateRoomNonAvailability";
import { useFormik } from "formik";
import { RoomIdSelect } from "../peak-season-rate/components/RoomIdSelect";
import { DatePickerWithRangeForRoomNonAvailability } from "./components/DateRoomNonAvailability";
import RoomNonAvailabilityList from "./components/RoomNonAvailability";
import { RoomNonAvailabilitySchema } from "./schemas/RoomNonAvailabilitySchema";

interface RoomNonAvailabilityPageProps {
  roomId: number;
}

const RoomNonAvailabilityPage = ({ roomId }: RoomNonAvailabilityPageProps) => {
  const { mutateAsync: createRoomNonAvailability, isPending } =
    useCreateRoomNonAvailability();

  const formik = useFormik({
    initialValues: {
      reason: "",
      startDate: new Date(),
      endDate: new Date(),
      roomId: 0,
    },
    validationSchema: RoomNonAvailabilitySchema,
    onSubmit: async (values) => {
      const dataToSubmit = {
        ...values,
        roomId: Number(values.roomId),
      };
      await createRoomNonAvailability(dataToSubmit);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">

        <header className="mb-8">
          <h1 className="text-2xl font-light text-gray-800 dark:text-gray-100 md:text-3xl">
            Room <span className="font-semibold">Availability Management</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Define periods when rooms are unavailable for booking
          </p>
        </header>


        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm transition-all dark:bg-gray-800">
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
            <h2 className="font-medium text-gray-700 dark:text-gray-300">
              Block Room Availability
            </h2>
          </div>

          <div className="p-6">
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col space-y-6 md:flex-row md:items-end md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/3">
                  <FormInput
                    name="reason"
                    label="Reason"
                    type="text"
                    placeholder="e.g. Maintenance, Renovation"
                    value={formik.values.reason}
                    isError={!!formik.touched.reason && !!formik.errors.reason}
                    error={formik.errors.reason}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <DatePickerWithRangeForRoomNonAvailability
                    setFieldValue={formik.setFieldValue}
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <RoomIdSelect setFieldValue={formik.setFieldValue} />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  className="px-6 transition-all hover:bg-opacity-90"
                  disabled={isPending}
                >
                  {isPending ? "Processing..." : "Block Room Availability"}
                </Button>
              </div>
            </form>
          </div>
        </div>


        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-700 dark:text-gray-300">
                Blocked Availability Periods
              </h2>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                {roomId ? "Filtered by Room" : "All Rooms"}
              </span>
            </div>
          </div>

          <div className="p-6">
            <RoomNonAvailabilityList roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomNonAvailabilityPage;
