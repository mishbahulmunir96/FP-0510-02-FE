import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatStatus, getStatusColor } from "@/types/status";
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import { Hotel, MapPin, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TransactionListCardProps {
  transaction: Transaction;
}

const TransactionListCard = ({ transaction }: TransactionListCardProps) => {
  const firstReservation = transaction.reservations[0];

  return (
    <Card className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md hover:ring-blue-100">
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-gray-50 to-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-white">
            <AvatarImage
              src={firstReservation.tenant.imageUrl || undefined}
              alt="Property Owner"
            />
            <AvatarFallback>
              <Image
                src="/images/profile_default.jpg"
                alt={firstReservation.tenant.name}
                fill
                className="object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
              {firstReservation.tenant.name}
            </span>
            <span className="text-xs text-gray-500">
              ID: {transaction.uuid}
            </span>
          </div>
        </div>
        <Badge
          className={`${getStatusColor(transaction.status)} rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide`}
        >
          {formatStatus(transaction.status)}
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="relative m-4 h-48 w-full flex-shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-48">
          <Image
            alt={firstReservation.propertyTitle}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            src="/images/room.avif"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="flex flex-1 flex-col sm:flex-row">
          <div className="flex-1 p-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                  {firstReservation.propertyTitle}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <p>{firstReservation.propertyLocation}</p>
                </div>
                <p className="mt-2 font-medium text-gray-700">
                  {firstReservation.roomType}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Booking Details
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="font-medium text-gray-900">
                      {transaction.checkInDate
                        ? format(
                            new Date(transaction.checkInDate),
                            "EE, MMM dd yyyy",
                          )
                        : "No Check-in Date"}
                    </p>
                  </div>

                  <Hotel className="h-5 w-5 text-blue-400" />

                  <div className="space-y-1 text-right">
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="font-medium text-gray-900">
                      {transaction.checkOutDate
                        ? format(
                            new Date(transaction.checkOutDate),
                            "EE, MMM dd yyyy",
                          )
                        : "No Check-out Date"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t p-4 sm:border-l sm:border-t-0 md:border-none">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-600">
                {transaction.totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
              </p>
              <p className="text-sm text-gray-500">
                {transaction.duration} nights
              </p>
            </div>
            <Button
              className="mt-4 w-full rounded-xl bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link href={`/transactions/${transaction.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionListCard;
