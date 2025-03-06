"use client";

import Image from "next/image";
import { Card, CardHeader } from "./ui/card";
import { RoomFacility } from "@/types/property";
import { FaSquareCheck } from "react-icons/fa6";

interface PropertyDetailCardProps {
  roomId: number;
  name: string;
  imageUrl: string;
  roomFacilities: RoomFacility[];
  price: number;
  guest: number;
  transactionId?: number;
}

const PropertyDetailCard = ({
  roomId,
  name,
  imageUrl,
  roomFacilities,
  price,
  guest,
  transactionId,
}: PropertyDetailCardProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="mt-7 md:mt-0">
      <div className="relative h-[300px] overflow-hidden rounded-lg">
        <Image
          src={imageUrl || "/placeholder-room.jpg"}
          alt={`${name} room image`}
          fill
          className="object-cover"
          priority
        />
      </div>
      <CardHeader>
        <div className="grid gap-y-7 md:grid-cols-2">
          <RoomInfo name={name} guest={guest} />
          <PriceInfo price={formatPrice(price)} />
          <FacilitiesList facilities={roomFacilities} />
        </div>
      </CardHeader>
    </Card>
  );
};

const RoomInfo = ({ name, guest }: { name: string; guest: number }) => (
  <div>
    <h4 className="text-center text-xl font-semibold">{name}</h4>
    <p className="text-center">Room for {guest} people</p>
  </div>
);

const PriceInfo = ({ price }: { price: string }) => (
  <div>
    <h4 className="mt-7 text-center text-base font-semibold md:mt-0">
      Price/room/night
    </h4>
    <p className="text-center text-xl font-medium text-[#396ee4]">{price}</p>
  </div>
);

const FacilitiesList = ({ facilities }: { facilities: RoomFacility[] }) => (
  <div className="text-center md:text-left">
    <h5 className="text-base font-semibold">Room Facilities</h5>
    <div className="grid gap-3">
      {facilities.map((facility) => (
        <div key={facility.id} className="space-y-1">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <FaSquareCheck className="flex-shrink-0 text-green-500" />
            <h5 className="line-clamp-1 font-medium">{facility.title}</h5>
          </div>
          <p className="line-clamp-3 pl-7 text-sm text-gray-600 md:pr-10">
            {facility.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default PropertyDetailCard;
