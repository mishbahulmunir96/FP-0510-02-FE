"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useGetReviewsByRoom from "@/hooks/api/review/useGetReviewsByRoom";
import { formatCurrency } from "@/lib/utils";
import { getRatingColor, getRatingLabel } from "@/types/review";
import { format } from "date-fns";
import { Loader2, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PriceDetails from "./PriceDetails";
import {
  calculatePricing,
  PeakSeasonRate,
} from "@/utils/reservationsPriceUtils";

interface ReservationCardProps {
  roomId: number;
  roomType: string;
  pricePerNight: number;
  checkIn: Date;
  checkOut: Date;
  roomImage: string;
  paymentMethod: string;
  isLoggedIn: boolean;
  peakSeasonRates: PeakSeasonRate[];
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

  const pricingDetails = calculatePricing(
    checkIn,
    checkOut,
    pricePerNight,
    peakSeasonRates,
  );
  const { totalPrice } = pricingDetails;

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
          <PriceDetails pricingDetails={pricingDetails} />
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
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              "Book Now"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;
