import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatStatus, getStatusColor } from "@/types/status";
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import { Hotel, MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TransactionListCardProps {
  transaction: Transaction;
}

const TransactionListCard = ({ transaction }: TransactionListCardProps) => {
  const firstReservation = transaction.reservations[0];

  return (
    <Card className="overflow-hidden rounded-md">
      <div className="flex flex-col sm:flex-row">
        <div className="relative m-4 h-48 w-full flex-shrink-0 overflow-hidden rounded-md sm:h-auto sm:w-48">
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
          <div className="flex flex-col justify-between border-t p-4 text-right sm:border-l sm:border-t-0">
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {transaction.totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {transaction.duration} nights
              </p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href={`/transactions/${transaction.id}`}>See Detail</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionListCard;
