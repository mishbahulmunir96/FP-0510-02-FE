import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TransactionDetail } from "@/types/transactionByTenant";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  CreditCard,
  Hotel,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";

interface PropertyInfoProps {
  reservation: any;
}

export const PropertyInfo = ({ reservation }: PropertyInfoProps) => {
  return (
    <div className="flex gap-4 sm:items-start">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-200">
        <Image
          src={reservation.propertyImages[0]}
          alt={`${reservation.propertyTitle} property`}
          className="object-cover"
          fill
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
          <h3 className="font-medium text-gray-900">
            {reservation.propertyTitle}
          </h3>
        </div>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span>{reservation.propertyLocation}</span>
        </p>
        <h2 className="text-xl font-semibold text-gray-900">
          {reservation.roomType} Room
        </h2>
      </div>
    </div>
  );
};

interface GuestDetailsProps {
  customer: {
    name: string;
    email: string;
    imageUrl: string;
  };
}

export const GuestDetails = ({ customer }: GuestDetailsProps) => {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-medium text-gray-900">
        <User className="h-4 w-4 text-blue-600" />
        Guest Details
      </h4>
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={customer.imageUrl} alt={customer.name} />
            <AvatarFallback>
              <Image
                src="/images/profile_default.jpg"
                alt={customer.name}
                fill
                className="object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{customer.name}</p>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReservationDetailsProps {
  checkInDate: string | null;
  checkOutDate: string | null;
}

export const ReservationDetails = ({
  checkInDate,
  checkOutDate,
}: ReservationDetailsProps) => {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-medium text-gray-900">
        <CalendarDays className="h-4 w-4 text-blue-600" />
        Reservation Details
      </h4>
      <div className="rounded-lg border p-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Check-in</p>
            <p className="font-medium text-gray-900">
              {checkInDate
                ? format(new Date(checkInDate), "EE, MMM dd yyyy")
                : "Not set"}
            </p>
          </div>

          <Hotel className="h-5 w-5 rotate-90 text-gray-400 sm:rotate-0" />

          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-500">Check-out</p>
            <p className="font-medium text-gray-900">
              {checkOutDate
                ? format(new Date(checkOutDate), "EE, MMM dd yyyy")
                : "Not set"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PaymentMethodProps {
  paymentMethod: string;
}

export const PaymentMethod = ({ paymentMethod }: PaymentMethodProps) => {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-medium text-gray-900">
        <CreditCard className="h-4 w-4 text-blue-600" />
        Payment Method
      </h4>
      <div className="rounded-lg border p-4">
        <Badge
          variant="outline"
          className={`${
            paymentMethod === "MANUAL"
              ? "border-orange-200 bg-orange-100 text-orange-700"
              : "border-green-200 bg-green-100 text-green-700"
          }`}
        >
          {paymentMethod === "MANUAL" ? "Manual Payment" : "Automatic Payment"}
        </Badge>
      </div>
    </div>
  );
};

interface RoomFacilitiesProps {
  facilities: string[];
}

export const RoomFacilities = ({ facilities }: RoomFacilitiesProps) => {
  if (facilities.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-medium text-gray-900">
        <ShieldCheck className="h-4 w-4 text-blue-600" />
        Room Facilities
      </h4>
      <div className="flex flex-wrap gap-2">
        {facilities.map((facility, index) => (
          <Badge key={index} variant="secondary">
            {facility}
          </Badge>
        ))}
      </div>
    </div>
  );
};
