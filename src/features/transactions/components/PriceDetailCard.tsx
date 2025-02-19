import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useGetReviewsByRoom from "@/hooks/api/review/useGetReviewsByRoom";
import { getRatingColor, getRatingLabel } from "@/types/review";
import { TransactionDetail } from "@/types/transaction";
import { Bed, Info, Shield, Star } from "lucide-react";
import Image from "next/image";

interface PriceDetailCardProps {
  data: TransactionDetail;
}

const PriceDetailCard = ({ data }: PriceDetailCardProps) => {
  const roomId = data.reservations[0].roomId;
  const { data: reviewsData } = useGetReviewsByRoom({
    roomId,
    page: 1,
    take: 1,
  });
  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-md">
      <CardHeader className="border-b p-4">
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {data.reservations[0].roomImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-40 w-full overflow-hidden rounded-lg">
                    <Image
                      src={image || "/images/room.avif"}
                      alt={`${data.reservations[0].propertyTitle} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute inset-y-14 left-14 right-14">
              <div className="flex h-full items-center justify-between px-2">
                <CarouselPrevious className="relative h-8 w-8 bg-white/60 hover:bg-white/90" />
                <CarouselNext className="relative h-8 w-8 bg-white/60 hover:bg-white/90" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-lg font-semibold text-white">
                {data.reservations[0].propertyTitle}
              </h3>
            </div>
          </Carousel>
        </div>

        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-blue-600" />

              <h3 className="font-medium text-gray-900">
                {data.reservations[0].roomType} Room
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Includes {data.reservations[0].roomFacilities[0]}
            </p>
          </div>
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
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          <Shield className="h-4 w-4" />
          <p>Your booking is protected by RateHaven Insurance</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-gray-900">Price Breakdown</h4>
          </div>
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price</span>
              <span className="font-medium text-gray-900">
                {data.reservations[0].roomPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>

            {data.peakSeasonPrice > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Peak Season Price</span>
                <span className="font-medium text-gray-900">
                  {data.peakSeasonPrice.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Length of Stay</span>
              <span className="font-medium text-gray-900">
                {data.duration} nights
              </span>
            </div>

            {data.peakSeasonDays > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Peak Season Days</span>
                <span className="font-medium text-gray-900">
                  {data.peakSeasonDays} days
                </span>
              </div>
            )}

            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Total Amount</span>
                <span className="font-semibold text-blue-600">
                  {data.totalPrice.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceDetailCard;
