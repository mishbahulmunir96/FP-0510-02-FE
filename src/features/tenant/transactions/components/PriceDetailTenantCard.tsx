"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Transaction } from "@/types/transactionByTenant";
import Image from "next/image";

interface PriceDetailTenantCardProps {
  data: Transaction;
}

const PriceDetailTenantCard = ({ data }: PriceDetailTenantCardProps) => {
  const firstReservation = data.reservations[0];

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3 p-4">
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {firstReservation.roomImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-40 w-full overflow-hidden rounded-lg">
                    <Image
                      src={image || "/images/room.avif"}
                      alt={`${firstReservation.propertyTitle} - Image ${index + 1}`}
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
          </Carousel>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {firstReservation.propertyTitle}
          </div>
          <h3 className="font-medium">
            {firstReservation.roomType} Room
            {firstReservation.roomFacilities[0] &&
              ` - Include ${firstReservation.roomFacilities[0]}`}
          </h3>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 p-4">
        <div className="space-y-3">
          <h4 className="font-medium">Price Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>
                {firstReservation.roomPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Peak Season Price</span>
              <span>
                {firstReservation.peakSeasonPrice?.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Stay</span>
              <span>{data.duration} nights</span>
            </div>
            <div className="flex justify-between">
              <span>Peak Season Days</span>
              <span>{firstReservation.peakSeasonDays}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-medium">
              <span>Total</span>
              <span>
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
      </CardContent>
    </Card>
  );
};

export default PriceDetailTenantCard;
