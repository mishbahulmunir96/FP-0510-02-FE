"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { DatePickerWithRangeForPeakSeason } from "./components/DateRangePickerPeakSeason";
import PeakSeasonsRateList from "./components/PeakSeasonRateList";
import { RoomIdSelect } from "./components/RoomIdSelect";
import { PeakSeasonRateSchema } from "./schemas/PeakSeasonRateSchema";
import { useCreatePeakSeasonRate } from "@/hooks/api/peak-season-rate/useCreatePeakSeasonRate";

interface PeakSeasonsPageProps {
  roomId: number;
}

const PeakSeasonRatePage = ({ roomId }: PeakSeasonsPageProps) => {
  const { mutateAsync: createPeakSeasonRate, isPending } =
    useCreatePeakSeasonRate();

  const formik = useFormik({
    initialValues: {
      price: 0,
      startDate: new Date(),
      endDate: new Date(),
      roomId: 0,
    },
    validationSchema: PeakSeasonRateSchema,
    onSubmit: async (values) => {
      const dataToSubmit = {
        ...values,
        price: Number(values.price),
        roomId: Number(values.roomId),
      };
      await createPeakSeasonRate(dataToSubmit);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-light text-gray-800 dark:text-gray-100 md:text-3xl">
            Peak Season <span className="font-semibold">Rate Management</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Set special rates for high-demand periods to maximize revenue
          </p>
        </header>
        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm transition-all dark:bg-gray-800">
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
            <h2 className="font-medium text-gray-700 dark:text-gray-300">
              Add New Rate
            </h2>
          </div>

          <div className="p-6">
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col space-y-6 md:flex-row md:items-end md:space-x-4 md:space-y-0">
                <div className="w-full md:w-1/3">
                  <FormInput
                    name="price"
                    label="Price"
                    type="number"
                    placeholder="0.00"
                    value={formik.values.price}
                    isError={!!formik.touched.price && !!formik.errors.price}
                    error={formik.errors.price}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <DatePickerWithRangeForPeakSeason
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
                  {isPending ? "Processing..." : "Add Peak Season Rate"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-700 dark:text-gray-300">
                Current Peak Season Rates
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {roomId ? "Filtered by Room" : "All Rooms"}
              </span>
            </div>
          </div>

          <div className="p-6">
            <PeakSeasonsRateList roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeakSeasonRatePage;
