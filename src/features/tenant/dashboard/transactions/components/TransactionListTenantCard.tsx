import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatStatus, getStatusColor } from "@/types/status";
import { Transaction } from "@/types/transactionByTenant";
import { format } from "date-fns";
import { CalendarDays, Hotel, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TransactionListTenantCardProps {
  transaction: Transaction;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "No date available";
  return format(new Date(dateString), "EE, MMM dd yyyy");
};

const TransactionListTenantCard = ({
  transaction,
}: TransactionListTenantCardProps) => {
  const firstReservation = transaction.reservations[0];
  return (
    <Card className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md hover:ring-blue-100">
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-gray-50 to-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarImage
              src={transaction.customer.imageUrl}
              alt="Customer"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <AvatarFallback>
              <Image
                src="/images/profile_default.jpg"
                alt={transaction.customer.name}
                fill
                className="object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
              {transaction.customer.name}
            </span>
            <span className="text-xs text-gray-500">
              ID: {transaction.uuid}
            </span>
          </div>
        </div>
        <Badge
          className={`${getStatusColor(transaction.status)} rounded-full px-4 py-1 text-xs font-medium uppercase tracking-wide`}
        >
          {formatStatus(transaction.status)}
        </Badge>
      </div>

      <div className="flex flex-col gap-6 p-4 md:flex-row">
        <div className="relative h-48 w-full overflow-hidden rounded-xl md:h-auto md:w-48">
          <Image
            alt={firstReservation.propertyTitle}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            src={firstReservation.roomImages[0].imageUrl || "/images/room.avif"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
              {firstReservation.propertyTitle}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <p className="text-gray-600">
                {firstReservation.propertyLocation}
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {firstReservation.roomType}
            </p>
          </div>

          <div className="mb-4 rounded-xl bg-gradient-to-r from-gray-50 to-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Booking Duration
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-medium text-gray-900">
                  {formatDate(transaction.checkInDate)}
                </p>
              </div>
              <Hotel className="h-5 w-5 text-blue-400" />
              <div className="text-right">
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-medium text-gray-900">
                  {formatDate(transaction.checkOutDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div>
              <Badge
                variant="secondary"
                className="rounded-full bg-blue-50 px-3 text-xs text-blue-600"
              >
                {transaction.duration} nights
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {transaction.totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
              </p>
              <Button
                className="mt-3 rounded-xl bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <Link href={`/tenant/dashboard/transactions/${transaction.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionListTenantCard;
