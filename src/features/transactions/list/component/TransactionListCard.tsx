import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import Image from "next/image";

interface TransactionListCardProps {
  transaction: Transaction;
}

const TransactionListCard = ({ transaction }: TransactionListCardProps) => {
  const firstReservation = transaction.reservations[0];

  return (
    <Card className="overflow-hidden rounded-md">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 w-full flex-shrink-0 sm:h-auto sm:w-48">
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
              <p className="text-sm text-muted-foreground">
                Check In:{" "}
                {transaction.checkIn
                  ? format(new Date(transaction.checkIn), "dd MMM yyyy")
                  : "-"}
              </p>
              <p className="text-sm text-muted-foreground">
                Check Out:{" "}
                {transaction.checkOut
                  ? format(new Date(transaction.checkOut), "dd MMM yyyy")
                  : "-"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {firstReservation.propertyLocation}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {firstReservation.propertyTitle}
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
            <Button className="w-full">See Details</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionListCard;
