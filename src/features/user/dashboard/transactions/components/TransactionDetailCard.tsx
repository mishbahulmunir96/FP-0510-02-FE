import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useGetReviewByTransaction from "@/hooks/api/review/useGetReviewByTransaction";
import { formatStatus, getStatusColor } from "@/types/status";
import { TransactionDetail } from "@/types/transaction";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  Hotel,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
import TransactionPaymentSection from "./TransactionPaymentSection";
import ViewReviewModal from "./viewReviewModal";

interface TransactionDetailCardProps {
  data: TransactionDetail;
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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);

  const { data: reviewData, isLoading: isLoadingReview } =
    useGetReviewByTransaction(data.id);

  const showReviewButton = data.status === "CHECKED_OUT" && !reviewData;
  const showViewReviewButton = data.status === "CHECKED_OUT" && reviewData;

  // Mengambil informasi bank dari tenant dalam rezervasi pertama
  const bankAccount = data.reservations[0]?.tenant
    ? {
        bankName: data.reservations[0].tenant.bankName,
        bankNumber: data.reservations[0].tenant.bankNumber,
        name: data.reservations[0].tenant.name,
      }
    : null;

  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-md">
      <CardHeader className="space-y-6 border-b bg-gray-50/50 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4 sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={data.reservations[0].propertyImages[0]}
                alt={`${data.reservations[0].propertyTitle} property`}
                className="object-cover"
                fill
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2
                  className="h-4 w-4 text-blue-600"
                  aria-hidden="true"
                />
                <h3 className="font-medium text-gray-900">
                  {data.reservations[0].propertyTitle}
                </h3>
              </div>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>{data.reservations[0].propertyLocation}</span>
              </p>
              <h2 className="text-xl font-semibold text-gray-900">
                {data.reservations[0].roomType} Room
              </h2>
            </div>
          </div>

          <div className="flex justify-between gap-4 sm:items-end md:flex-col">
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">
                {data.totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="block text-sm text-gray-500">Total Amount</span>
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className={getStatusColor(data.status)}>
                {formatStatus(data.status)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-medium text-gray-900">
            <User className="h-4 w-4 text-blue-600" />
            Tenant Details
          </h4>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={
                    data.reservations[0].tenant.imageUrl ||
                    "/images/profile_default.jpg"
                  }
                  alt={data.reservations[0].tenant.name}
                  className="border border-green-500"
                />
                <AvatarFallback>
                  {data.reservations[0].tenant.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {data.reservations[0].tenant.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-medium text-gray-900">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            Stay Details
          </h4>
          <div className="rounded-lg border p-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-medium text-gray-900">
                  {data.checkInDate
                    ? format(new Date(data.checkInDate), "EEE, MMM dd yyyy")
                    : "Not set"}
                </p>
              </div>

              <Hotel className="h-5 w-5 rotate-90 text-gray-400 sm:rotate-0" />

              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-medium text-gray-900">
                  {data.checkOutDate
                    ? format(new Date(data.checkOutDate), "EEE, MMM dd yyyy")
                    : "Not set"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Badge variant="secondary" className="text-sm">
                {data.duration} Night Stay
              </Badge>
            </div>
          </div>
        </div>

        <TransactionPaymentSection
          paymentMethode={data.paymentMethode}
          paymentProof={data.paymentProof}
          status={data.status}
          isUploadDisabled={
            data.status === "CANCELLED" ||
            data.status === "PROCESSED" ||
            data.status === "WAITING_FOR_PAYMENT_CONFIRMATION" ||
            data.status === "CHECKED_IN" ||
            data.status === "CHECKED_OUT" ||
            (data.paymentMethode === "OTOMATIS" &&
              data.status === "WAITING_FOR_PAYMENT")
          }
          isCancelDisabled={
            data.status !== "WAITING_FOR_PAYMENT" ||
            data.paymentMethode === "OTOMATIS" ||
            isCancelling
          }
          isUploading={isUploading}
          isCancelling={isCancelling}
          invoiceUrl={data.invoiceUrl}
          bankAccount={bankAccount} // Menambahkan properti bankAccount
          onUploadProof={onUploadProof}
          onCancelTransaction={onCancelTransaction}
        />

        {data.reservations[0].roomFacilities.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-medium text-gray-900">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Room Facilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.reservations[0].roomFacilities.map((facility, index) => (
                <Badge key={index} variant="secondary">
                  {facility}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {(showReviewButton || showViewReviewButton) && (
          <div className="border-t pt-6">
            {showReviewButton && (
              <Button
                onClick={() => setIsReviewModalOpen(true)}
                variant="outline"
                className="w-full"
              >
                Write a Review
              </Button>
            )}

            {showViewReviewButton && (
              <Button
                onClick={() => setIsViewReviewModalOpen(true)}
                variant="secondary"
                className="w-full"
              >
                View Your Review
              </Button>
            )}
          </div>
        )}

        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          paymentId={data.id}
        />

        {reviewData && (
          <ViewReviewModal
            isOpen={isViewReviewModalOpen}
            onClose={() => setIsViewReviewModalOpen(false)}
            review={reviewData}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionDetailCard;
