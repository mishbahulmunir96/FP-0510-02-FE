"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface PriceDetailCardProps {
  data: {
    duration: number;
    totalPrice: number;
    reservations: Array<{
      propertyTitle: string;
      roomType: string;
      roomFacilities: string[];
      roomPrice: number;
    }>;
  };
}

const PriceDetailCard = ({ data }: PriceDetailCardProps) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-3 p-4">
        <div className="relative h-40 w-full overflow-hidden rounded-lg">
          <Image
            src="/images/room.avif"
            alt={`${data.reservations[0].propertyTitle}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            CVK Park Bosphorus...
          </div>
          <h3 className="font-medium">
            {data.reservations[0].roomType} Room - Include{" "}
            {data.reservations[0].roomFacilities[0]}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="rounded bg-green-600 px-1.5 py-0.5 text-sm font-medium text-white">
                4.2
              </span>
              <span className="text-sm font-medium">Very Good</span>
            </div>
            <span className="text-sm text-muted-foreground">54 reviews</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-2 text-sm">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#5C3EBA"
            />
            <path
              d="M7.99995 12.0001L10.6666 14.6667L16 9.33341"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Your booking is protected by PhonePe
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Price Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>
                {data.reservations[0].roomPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Peak Price</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between">
              <span>stay</span>
              <span>{data.duration} nights</span>
            </div>
            <div className="flex justify-between">
              <span>Day of peak season</span>
              <span>0</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-medium">
              <span>Total</span>
              <span>
                {data.totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceDetailCard;
