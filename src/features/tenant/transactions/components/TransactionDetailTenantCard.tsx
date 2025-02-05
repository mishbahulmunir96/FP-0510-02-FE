"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import useGetReviewByTenant from "@/hooks/api/review/useGetReviewByTenant";
import useApproveTransactionByTenant from "@/hooks/api/transaction/useApproveTransactionByTenant";
import { formatStatus, getStatusColor } from "@/types/status";
import { Transaction } from "@/types/transactionByTenant";
import { format } from "date-fns";
import { Check, Eye, Hotel, MapPin, X } from "lucide-react";
import Image from "next/image";
import ReviewCard from "./ReviewCard";

interface TransactionDetailTenantCardProps {
  data: Transaction;
}

const TransactionDetailTenantCard = ({
  data,
}: TransactionDetailTenantCardProps) => {
  const firstReservation = data.reservations[0];

  const { data: reviewData } = useGetReviewByTenant(data.id);
  const approveTransaction = useApproveTransactionByTenant();

  const handleApproval = (isApproved: boolean) => {
    approveTransaction.mutate({
      paymentId: data.id,
      isApproved,
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-medium">
            {firstReservation.roomType} Room
          </h2>
          <div className="text-right">
            <span className="text-2xl font-semibold text-blue-600">
              {data.totalPrice.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-md">
            <Image
              src={firstReservation.roomImages[0] || "/images/room.avif"}
              alt="Property Image"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{firstReservation.propertyTitle}</h3>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {firstReservation.propertyLocation}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Reserver</h4>
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={data.customer.imageUrl}
                  alt={data.customer.name}
                />
                <AvatarFallback>
                  <Image
                    src="/images/profile_default.jpg"
                    alt={data.customer.name}
                    fill
                    className="object-cover"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{data.customer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {data.customer.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Check-in</p>
            <p className="font-medium">
              {data.checkInDate
                ? format(new Date(data.checkInDate), "EE, MMM dd yyyy")
                : "No Check-in Date"}
            </p>
          </div>

          <Hotel className="h-5 w-5 text-muted-foreground" />

          <div className="space-y-1 text-right">
            <p className="text-sm text-muted-foreground">Check-out</p>
            <p className="font-medium">
              {data.checkOutDate
                ? format(new Date(data.checkOutDate), "EE, MMM dd yyyy")
                : "No Check-out Date"}
            </p>
          </div>
        </div>
        <Separator />
        {firstReservation.roomFacilities.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Room Facilities</h4>
            <div className="flex flex-wrap gap-2">
              {firstReservation.roomFacilities.map((facility, index) => (
                <span
                  key={index}
                  className="rounded-full bg-secondary px-3 py-1 text-sm"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <span
            className={`rounded-full border px-3 py-1 text-sm ${getStatusColor(
              data.status,
            )}`}
          >
            {formatStatus(data.status)}
          </span>

          {data.paymentProof && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Proof
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Payment Proof</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <Image
                    src={data.paymentProof}
                    alt="Payment Proof"
                    width={400}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {data.status === "WAITING_FOR_PAYMENT_CONFIRMATION" && (
          <div className="flex justify-around gap-2 md:justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleApproval(false)}
              disabled={approveTransaction.isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleApproval(true)}
              disabled={approveTransaction.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        )}

        {reviewData && (
          <div className="space-y-2">
            <h4 className="font-medium">Customer Review</h4>
            <ReviewCard review={reviewData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionDetailTenantCard;
