import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useGetReviewByTransaction from "@/hooks/api/review/useGetReviewByTransaction";
import { formatStatus, getStatusColor } from "@/types/status";
import { TransactionDetail } from "@/types/transaction";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { Building2, CalendarDays, Hotel, MapPin, User } from "lucide-react";
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

  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-md">
      <CardHeader className="border-b bg-gray-50/50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {data.reservations[0].roomType} Room
            </h2>
            <Badge variant="outline" className={getStatusColor(data.status)}>
              {formatStatus(data.status)}
            </Badge>
          </div>
          <div className="text-right">
            <span className="block text-sm text-gray-500">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">
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

      <CardContent className="space-y-6 p-6">
        {/* Property Details */}
        <div className="rounded-lg border bg-gray-50/50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={data.reservations[0].propertyImages[0]}
                alt="Property"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-gray-900">
                  {data.reservations[0].propertyTitle}
                </h3>
              </div>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {data.reservations[0].propertyLocation}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-medium text-gray-900">
            <User className="h-4 w-4 text-blue-600" />
            Guest Information
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
                />
                <AvatarFallback>
                  {data.reservations[0].tenant.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {data.reservations[0].tenant.name}
                </p>
                <p className="text-sm text-gray-500">Primary Guest</p>
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
            data.status !== "WAITING_FOR_PAYMENT" || isCancelling
          }
          isUploading={isUploading}
          isCancelling={isCancelling}
          invoiceUrl={data.invoiceUrl}
          onUploadProof={onUploadProof}
          onCancelTransaction={onCancelTransaction}
        />

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
