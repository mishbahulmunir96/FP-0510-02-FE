"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetRoom from "@/hooks/api/room/useGetRoom";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import BankDetail from "./components/BankDetail";
import InputElementDetail from "./components/InputElementDetail";
import PropertyRules from "./components/PropertyRules";
import ReservationCard from "./components/ReservationCard";
import Link from "next/link";
import { useFormik } from "formik";
import { PaymentSchema } from "./components/SchemaPayment";
import { toast } from "react-toastify";
import useCreateReservation from "@/hooks/api/transaction/useCreateReservation";

const TransactionPage = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();
  const createReservation = useCreateReservation();

  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn")
    ? new Date(searchParams.get("checkIn")!)
    : new Date();
  const checkOut = searchParams.get("checkOut")
    ? new Date(searchParams.get("checkOut")!)
    : new Date();

  const { data: roomDetail, isLoading, error } = useGetRoom(Number(roomId));

  const formik = useFormik({
    initialValues: {
      paymentMethod: "",
    },
    validationSchema: PaymentSchema,
    onSubmit: async (values) => {
      if (!session) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      createReservation.mutate({
        roomId: Number(roomId),
        startDate: checkIn,
        endDate: checkOut,
        paymentMethode: values.paymentMethod === "auto" ? "OTOMATIS" : "MANUAL",
      });
    },
  });

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">Error loading room details</div>
      </div>
    );

  const property = roomDetail?.property;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="flex-1 space-y-8">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <button className="mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <Link href={`/property/${property?.slug}`}>Back</Link>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                Book: {property?.title}
              </h1>
              <p className="mt-2 text-gray-600">{property?.location}</p>

              <div className="mt-6 md:hidden">
                <ReservationCard
                  roomId={Number(roomId)}
                  roomType={roomDetail?.type || ""}
                  pricePerNight={roomDetail?.price || 0}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  roomImage={
                    roomDetail?.roomImage[0]?.imageUrl || "/images/room.avif"
                  }
                  paymentMethod={formik.values.paymentMethod}
                  isLoggedIn={!!session}
                  peakSeasonRates={roomDetail?.peakSeasonRate || []}
                  onSubmit={formik.handleSubmit}
                  isSubmitting={createReservation.isPending}
                />
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600">
                  1
                </span>
                Personal Data
              </h2>
              <div className="mt-6 space-y-6">
                <InputElementDetail
                  label="Name"
                  placeholder="John Doe"
                  defaultValue={session?.user.name || ""}
                />
                <InputElementDetail
                  label="Email Address"
                  placeholder="example@mail.com"
                  defaultValue={session?.user.email || ""}
                />
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600">
                  2
                </span>
                Payment Details
              </h2>
              <form onSubmit={formik.handleSubmit}>
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Choose Payment Method
                  </label>
                  <Select
                    name="paymentMethod"
                    value={formik.values.paymentMethod}
                    onValueChange={(value) =>
                      formik.setFieldValue("paymentMethod", value)
                    }
                    onOpenChange={() =>
                      formik.setFieldTouched("paymentMethod", true)
                    }
                  >
                    <SelectTrigger
                      className={`h-11 w-full rounded-lg border-gray-200 md:w-[70%] ${
                        formik.touched.paymentMethod &&
                        formik.errors.paymentMethod
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        Automatic Confirmation
                      </SelectItem>
                      <SelectItem value="manual">
                        Manual Confirmation
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {formik.touched.paymentMethod &&
                  formik.errors.paymentMethod ? (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.paymentMethod}
                    </p>
                  ) : null}

                  {formik.values.paymentMethod === "manual" && (
                    <div className="mt-6">
                      <h3 className="mb-4 text-lg font-medium text-gray-900">
                        Bank Account Details
                      </h3>
                      <BankDetail />
                    </div>
                  )}
                </div>
              </form>
            </div>

            <PropertyRules />
          </div>

          <div className="hidden w-full md:block lg:w-[400px]">
            <div className="sticky top-8">
              <ReservationCard
                roomId={Number(roomId)}
                roomType={roomDetail?.type || ""}
                pricePerNight={roomDetail?.price || 0}
                checkIn={checkIn}
                checkOut={checkOut}
                roomImage={
                  roomDetail?.roomImage[0]?.imageUrl || "/images/room.avif"
                }
                paymentMethod={formik.values.paymentMethod}
                isLoggedIn={!!session}
                peakSeasonRates={roomDetail?.peakSeasonRate || []}
                onSubmit={formik.handleSubmit}
                isSubmitting={createReservation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionPage;
