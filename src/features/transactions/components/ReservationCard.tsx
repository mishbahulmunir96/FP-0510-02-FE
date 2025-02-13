"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useGetReviewsByRoom from "@/hooks/api/review/useGetReviewsByRoom";
import useCreateReservation from "@/hooks/api/transaction/useCreateReservation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
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
}: ReservationCardProps) => {
  const createReservation = useCreateReservation();
  const router = useRouter();

  const { data: reviewsData } = useGetReviewsByRoom({
    roomId,
    page: 1,
    take: 1, // Kita hanya butuh metadata saja
  });

  // Fungsi untuk menentukan label rating
  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Outstanding";
    if (rating >= 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3) return "Fair";
    return "Average";
  };

  // Fungsi untuk menentukan warna background rating
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-600";
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3.5) return "bg-yellow-500";
    if (rating >= 3) return "bg-yellow-400";
    return "bg-gray-500";
  };

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

    createReservation.mutate({
      roomId,
      startDate: checkIn,
      endDate: checkOut,
      paymentMethode: paymentMethod === "auto" ? "OTOMATIS" : "MANUAL",
    });
  };

  return (
    <div className="mt-10 w-full md:w-[35%]">
      <Card className="w-full space-y-6 p-6">
        <div className="relative h-40 overflow-hidden rounded-md">
          <Image
            src={roomImage}
            alt={`${roomType} room view`}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-2 border-b">
          <div>
            <h3 className="font-semibold">{roomType} Room</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {reviewsData?.meta.averageRating ? (
                  <>
                    <span
                      className={`flex rounded ${getRatingColor(reviewsData.meta.averageRating)} px-1.5 py-0.5 text-sm font-medium text-white`}
                    >
                      <Star
                        className="h-4 w-4 text-yellow-400"
                        fill="currentColor"
                      />
                      {reviewsData.meta.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm font-medium">
                      {getRatingLabel(reviewsData.meta.averageRating)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No rating yet
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {reviewsData?.meta.total
                  ? `${reviewsData.meta.total} ulasan`
                  : "0 ulasan"}
              </span>
            </div>
          </div>
          <div className="space-y-1 pt-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span>{format(checkIn, "EEE, dd MMM yyyy", { locale: id })}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span>
                {format(checkOut, "EEE, dd MMM yyyy", { locale: id })}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Price Details</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Base Price</span>
              <span>Rp {basePrice.toLocaleString("id-ID")},00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>stay</span>
              <span>
                {nights} night{nights > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Peak Season Price</span>
              <span>Rp {peakSeasonRatePerNight.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Peak Season Days</span>
              <span>{peakSeasonDays}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-base font-semibold">Total</span>
              <span className="text-base font-semibold">
                Rp {totalPrice.toLocaleString("id-ID")},00
              </span>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-blue-500 py-6 text-lg hover:bg-blue-600"
          onClick={handleReservation}
          disabled={createReservation.isPending}
        >
          {createReservation.isPending ? "Processing..." : "Pesan"}
        </Button>
      </Card>
    </div>
  );
};

export default ReservationCard;
