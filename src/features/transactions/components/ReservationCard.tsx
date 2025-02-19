"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useGetReviewsByRoom from "@/hooks/api/review/useGetReviewsByRoom";
import { formatCurrency } from "@/lib/utils";
import { getRatingColor, getRatingLabel } from "@/types/review";
import { format } from "date-fns";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ReservationCardProps {
  roomId: number;
  roomType: string;
  pricePerNight: number;
  checkIn: Date;
  checkOut: Date;
  roomImage: string;
  paymentMethod: string;
  isLoggedIn: boolean;
  peakSeasonRates: {
    id: number;
    startDate: string;
    endDate: string;
    price: number;
  }[];
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

const ReservationCard = ({
  roomId,
  roomType,
  pricePerNight,
  checkIn,
  checkOut,
  roomImage,
  paymentMethod,
  isLoggedIn,
  peakSeasonRates,
  onSubmit,
  isSubmitting,
}: ReservationCardProps) => {
  const router = useRouter();
  const { data: reviewsData } = useGetReviewsByRoom({
    roomId,
    page: 1,
    take: 1,
  });

  const calculatePricing = () => {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let totalPrice = 0;
    let peakSeasonDays = 0;
    let peakSeasonRatePerNight = 0;
    let basePrice = pricePerNight;

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkIn);
      currentDate.setDate(currentDate.getDate() + i);
      currentDate.setHours(0, 0, 0, 0);

      const isPeakSeason = peakSeasonRates.some((rate) => {
        const startDate = new Date(rate.startDate);
        const endDate = new Date(rate.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return currentDate >= startDate && currentDate <= endDate;
      });

      if (isPeakSeason) {
        const peakRate = peakSeasonRates.find((rate) => {
          const startDate = new Date(rate.startDate);
          const endDate = new Date(rate.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          return currentDate >= startDate && currentDate <= endDate;
        });

        if (peakRate) {
          peakSeasonDays++;
          peakSeasonRatePerNight = peakRate.price;
          totalPrice += peakRate.price;
        }
      } else {
        totalPrice += basePrice;
      }
    }

    return {
      totalPrice,
      nights,
      basePrice,
      peakSeasonDays,
      peakSeasonRatePerNight,
    };
  };

  const {
    totalPrice,
    nights,
    basePrice,
    peakSeasonDays,
    peakSeasonRatePerNight,
  } = calculatePricing();

  const handleReservation = () => {
    if (!isLoggedIn) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select payment method");
      return;
    }

    onSubmit();
  };

  return (
    <Card className="border-none bg-transparent shadow-none md:overflow-hidden md:rounded-lg md:bg-white md:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden rounded-lg md:rounded-none">
        <Image
          src={roomImage}
          alt={`${roomType} room view`}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-0 md:p-6">
        <div className="mb-6 border-b-0 pb-6 md:border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {roomType} Room
          </h3>

          <div className="mt-2 flex items-center gap-3">
            {reviewsData?.meta.averageRating ? (
              <>
                <span
                  className={`flex items-center gap-1 rounded-lg ${getRatingColor(reviewsData.meta.averageRating)} px-2 py-1 text-white`}
                >
                  <Star className="h-4 w-4" fill="currentColor" />
                  <span className="font-medium">
                    {reviewsData.meta.averageRating.toFixed(1)}
                  </span>
                </span>
                <span className="font-medium text-gray-700">
                  {getRatingLabel(reviewsData.meta.averageRating)}
                </span>
                <span className="text-sm text-gray-500">
                  ({reviewsData.meta.total} reviews)
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">No ratings yet</span>
            )}
          </div>

          <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Check-in</span>
              <span className="font-medium text-gray-900">
                {format(checkIn, "EEE, dd MMM yyyy")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Check-out</span>
              <span className="font-medium text-gray-900">
                {format(checkOut, "EEE, dd MMM yyyy")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Price Details</h4>
          <div className="space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Price</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(basePrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium text-gray-900">
                {nights} night{nights > 1 ? "s" : ""}
              </span>
            </div>
            {peakSeasonDays > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Peak Season Rate</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(peakSeasonRatePerNight)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Peak Season Days</span>
                  <span className="font-medium text-gray-900">
                    {peakSeasonDays}
                  </span>
                </div>
              </>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Total Price</span>
                <span className="text-lg font-semibold text-blue-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="center fixed bottom-0 left-0 right-0 z-10 w-full border-t bg-white/95 backdrop-blur-sm md:static md:border-none">
        <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 pb-8 pt-4 md:flex-row md:p-0">
          <div className="mb-4 flex items-center justify-between md:hidden">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Total Price</span>
              <span className="text-xl font-semibold text-gray-900">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>

          <Button
            className="h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 md:mx-4 md:mb-4"
            onClick={handleReservation}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Book Now"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;
