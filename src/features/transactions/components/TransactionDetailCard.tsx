"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatStatus, getStatusColor } from "@/types/status";
import { format } from "date-fns";
import { Hotel, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import TransactionPaymentSection from "./TransactionPaymentSection";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Transaction } from "@/types/transaction";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface TransactionDetailCardProps {
  data: Transaction;
  onUploadProof: (file: File) => void;
  onCancelTransaction: () => void;
  isUploading: boolean;
  isCancelling: boolean;
}

const TransactionDetailCard = ({
  data,
  onUploadProof,
  onCancelTransaction,
  isUploading,
  isCancelling,
}: TransactionDetailCardProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const isUploadDisabled =
    data.status === "CANCELLED" ||
    data.status === "PROCESSED" ||
    data.status === "WAITING_FOR_PAYMENT_CONFIRMATION";

  const isCancelDisabled =
    data.status !== "WAITING_FOR_PAYMENT" || isCancelling;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-medium">
            {data.reservations[0].roomType} Room
          </h2>
          <div className="text-right">
            <span className="text-2xl font-semibold text-blue-600">
              {data.totalPrice.toLocaleString("id-Id", {
                style: "currency",
                currency: "IDR",
              })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-md">
            <Image
              src="/images/room.avif"
              alt="tenant Image"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">
              {data.reservations[0].propertyTitle}
            </h3>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {data.reservations[0].propertyLocation}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Tenant</h4>
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={
                    data.reservations[0].tenant.imageUrl ||
                    "/images/profile_default.jpg"
                  }
                  alt={data.reservations[0].tenant.name}
                />
                <AvatarFallback>
                  <Image
                    src="/images/profile_default.jpg"
                    alt={data.reservations[0].tenant.name}
                    fill
                    className="object-cover"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {data.reservations[0].tenant.name}
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

        <TransactionPaymentSection
          paymentMethode={data.paymentMethode}
          paymentProof={data.paymentProof}
          status={data.status}
          isUploadDisabled={isUploadDisabled}
          isCancelDisabled={isCancelDisabled}
          isUploading={isUploading}
          isCancelling={isCancelling}
          onUploadProof={onUploadProof}
          onCancelTransaction={onCancelTransaction}
        />

        <div className="flex justify-between pt-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-sm">
            {data.duration} Night
          </span>
          <span
            className={`rounded-full px-3 py-1 text-sm ${getStatusColor(
              data.status,
            )}`}
          >
            {formatStatus(data.status)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetailCard;
