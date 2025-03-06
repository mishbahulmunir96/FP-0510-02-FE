import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Card, CardHeader } from "./ui/card";
import { Pencil, Building2 } from "lucide-react";

interface RoomCardProps {
  id: number;
  name: string;
  stock: number;
  price: number;
  guest: number;
  imageUrl: string;
  propertyTitle: string;
  type: string;
}

const RoomCard: FC<RoomCardProps> = ({
  id,
  name,
  stock,
  price,
  guest,
  imageUrl,
  propertyTitle,
  type,
}) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Link
          href={`/tenant/dashboard/property/room/${id}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </Link>
      </div>

      <Link href={`/tenant/dashboard/property/room/${id}`}>
        <CardHeader className="space-y-4">
          <div className="absolute left-3 top-3 z-10">
            <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span>{propertyTitle}</span>
            </div>
          </div>

          <div className="relative h-[300px] overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Image
              src={imageUrl || "/placeholder-room.jpg"}
              alt={`${type} Room at ${propertyTitle}`}
              fill
              className="transform object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 space-y-1 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-sm font-medium">{type} Room</p>
              <h4 className="text-lg font-semibold">{name}</h4>
            </div>
          </div>
        </CardHeader>

        <CardHeader>
          <div className="-mt-7 space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h4 className="text-center text-sm font-medium text-gray-600">
                Price/room/night
              </h4>
              <p className="text-center text-xl font-semibold text-[#396ee4]">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(price)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-medium">{guest} people</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <p className="text-sm text-gray-600">Available</p>
                <p className="font-medium">{stock} Rooms</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
};

export default RoomCard;
