import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatStatus, getStatusColor } from "@/types/status";
import { Transaction } from "@/types/transactionByTenant";
import { format } from "date-fns";
import { Hotel } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TransactionListTenantCardProps {
  transaction: Transaction;
}

const TransactionListTenantCard = ({
  transaction,
}: TransactionListTenantCardProps) => {
  const firstReservation = transaction.reservations[0];

  return (
    <Card className="overflow-hidden rounded-md">
      <div className="flex items-center justify-between border-b bg-blue-50 px-4 py-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={transaction.customer.imageUrl} alt="@shadcn" />
            <AvatarFallback>
              <Image
                src="/images/profile_default.jpg"
                alt={transaction.customer.name}
                fill
                className="object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <span className="first-letter:capitalize">
            {transaction.customer.name}
          </span>
        </div>
        <span className="flex w-1/2 flex-col md:w-72 md:flex-row md:justify-between md:gap-1">
          <span className="text-nowrap">Transaction number:</span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {transaction.uuid}
          </span>
        </span>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="relative my-4 ml-4 h-48 w-80 overflow-hidden rounded-md md:h-auto md:w-48">
          <Image
            alt={firstReservation.propertyTitle}
            className="object-cover"
            fill
            src="/images/room.avif"
          />
        </div>
        <div className="flex flex-1 flex-col sm:flex-row">
          <div className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {firstReservation.propertyTitle}
              </h3>
              <p className="font-medium">{firstReservation.roomType}</p>
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="text-sm font-medium">
                    {transaction.checkInDate
                      ? format(
                          new Date(transaction.checkInDate),
                          "EE, MMM dd yyyy",
                        )
                      : "No Check-in Date"}
                  </p>
                </div>

                <Hotel className="h-5 w-5 text-muted-foreground" />

                <div className="space-y-1 text-right">
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="text-sm font-medium">
                    {transaction.checkOutDate
                      ? format(
                          new Date(transaction.checkOutDate),
                          "EE, MMM dd yy",
                        )
                      : "No Check-out Date"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {firstReservation.propertyLocation}
                </Badge>
                <Badge className={`${getStatusColor(transaction.status)}`}>
                  {formatStatus(transaction.status)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t p-4 text-right md:border-none">
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {transaction.totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {transaction.duration} nights
              </p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href={`/tenant/transactions/${transaction.id}`}>
                See Detail
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionListTenantCard;
