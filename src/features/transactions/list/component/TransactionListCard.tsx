import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

export interface Transaction {
  id: number;
  totalPrice: number;
  duration: number;
  checkIn: string; // Menggunakan tipe string jika Anda menggunakan Show Date String
  checkOut: string;
  reservations: Array<{
    roomType: string | null;
  }>;
}

interface TransactionListCardProps {
  transaction: Transaction; // Menentukan tipe props
}

const TransactionListCard: React.FC<TransactionListCardProps> = ({
  transaction,
}) => {
  return (
    <Card className="overflow-hidden rounded-md">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 w-full flex-shrink-0 sm:h-auto sm:w-48">
          <Image
            alt="name"
            className="object-cover"
            fill
            src="/images/room.avif"
          />
        </div>
        <div className="flex flex-1 flex-col sm:flex-row">
          <div className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Transaction ID: {transaction.id}
              </h3>
              <p className="font-medium">
                Room Type: {transaction.reservations[0]?.roomType || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                Check In: {new Date(transaction.checkIn).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Check Out: {new Date(transaction.checkOut).toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  #tag
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between border-t p-4 text-right sm:border-l sm:border-t-0">
            <div className="space-y-1">
              <p className="text-2xl font-bold">${transaction.totalPrice}</p>
              <p className="text-sm text-muted-foreground">
                Duration: {transaction.duration} nights
              </p>
            </div>
            <Button className="w-full">See booking options</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionListCard;
