import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useGetReviewByTenant from "@/hooks/api/review/useGetReviewByTenant";
import useApproveTransactionByTenant from "@/hooks/api/transaction/useApproveTransactionByTenant";
import useCancelTransactionByTenant from "@/hooks/api/transaction/useCancelTransactionsByTenant";
import useConfirmCheckIn from "@/hooks/api/transaction/useConfirmCheckIn";
import useConfirmCheckOut from "@/hooks/api/transaction/useConfirmCheckout";
import { formatStatus, getStatusColor } from "@/types/status";
import { TransactionDetail } from "@/types/transactionByTenant";
import { Star } from "lucide-react";
import ReviewCard from "./ReviewCard";
import { isCheckInTime, isCheckOutTime } from "@/utils/transactionsUtils";
import {
  GuestDetails,
  PaymentMethod,
  PropertyInfo,
  ReservationDetails,
  RoomFacilities,
} from "./TransactionCardAction";
import {
  PaymentConfirmationActions,
  PaymentProofView,
} from "./TranssactionAction";
import CancelOrderAction from "./CancelOrderAction";
import CheckInOutActions from "./CheckInOutAction";

interface TransactionDetailTenantCardProps {
  data: TransactionDetail;
}

const TransactionDetailTenantCard = ({
  data,
}: TransactionDetailTenantCardProps) => {
  const firstReservation = data.reservations[0];
  const { data: reviewData } = useGetReviewByTenant(data.id);
  const approveTransaction = useApproveTransactionByTenant();
  const { mutate: cancelTransaction, isPending: isCancelling } =
    useCancelTransactionByTenant();

  const { mutate: checkIn, isPending: isCheckingIn } = useConfirmCheckIn();
  const { mutate: checkOut, isPending: isCheckingOut } = useConfirmCheckOut();

  const handleCheckIn = () => {
    checkIn(data.id);
  };

  const handleCheckOut = () => {
    checkOut(data.id);
  };

  const handleApproval = (isApproved: boolean) => {
    approveTransaction.mutate({
      paymentId: data.id,
      isApproved,
    });
  };

  const handleCancel = () => {
    cancelTransaction(data.id);
  };

  const showCheckInButton =
    data.status === "PROCESSED" && isCheckInTime(data.checkInDate);
  const showCheckOutButton =
    data.status === "CHECKED_IN" && isCheckOutTime(data.checkOutDate);

  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-md">
      <CardHeader className="space-y-6 border-b bg-gray-50/50 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <PropertyInfo reservation={firstReservation} />

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
        <GuestDetails customer={data.customer} />
        <ReservationDetails
          checkInDate={data.checkInDate}
          checkOutDate={data.checkOutDate}
        />
        <PaymentMethod paymentMethod={data.paymentMethode} />
        <RoomFacilities facilities={firstReservation.roomFacilities} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {data.paymentProof && !(data.paymentMethode === "OTOMATIS") && (
            <PaymentProofView paymentProof={data.paymentProof} />
          )}
        </div>

        {data.status === "WAITING_FOR_PAYMENT_CONFIRMATION" && (
          <PaymentConfirmationActions
            isPending={approveTransaction.isPending}
            onReject={() => handleApproval(false)}
            onApprove={() => handleApproval(true)}
          />
        )}

        {reviewData && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-medium text-gray-900">
              <Star className="h-4 w-4 text-blue-600" />
              Customer Review
            </h4>
            <ReviewCard review={reviewData} />
          </div>
        )}

        {data.status === "WAITING_FOR_PAYMENT" &&
          data.paymentMethode === "MANUAL" && (
            <CancelOrderAction
              isCancelling={isCancelling}
              onCancel={handleCancel}
            />
          )}

        {(showCheckInButton || showCheckOutButton) && (
          <CheckInOutActions
            showCheckInButton={showCheckInButton}
            showCheckOutButton={showCheckOutButton}
            isCheckingIn={isCheckingIn}
            isCheckingOut={isCheckingOut}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionDetailTenantCard;
