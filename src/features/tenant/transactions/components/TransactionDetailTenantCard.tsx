import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetReviewByTenant from "@/hooks/api/review/useGetReviewByTenant";
import useApproveTransactionByTenant from "@/hooks/api/transaction/useApproveTransactionByTenant";
import useCancelTransactionByTenant from "@/hooks/api/transaction/useCancelTransactionsByTenant";
import useConfirmCheckIn from "@/hooks/api/transaction/useConfirmCheckIn";
import useConfirmCheckOut from "@/hooks/api/transaction/useConfirmCheckout";
import { formatStatus, getStatusColor } from "@/types/status";
import { TransactionDetail } from "@/types/transactionByTenant";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Eye,
  Hotel,
  MapPin,
  ShieldCheck,
  Star,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import ReviewCard from "./ReviewCard";

interface TransactionDetailTenantCardProps {
  data: TransactionDetail;
}

const isCheckInTime = (checkInDate: string | null): boolean => {
  if (!checkInDate) return false;
  const checkInTime = new Date(checkInDate);
  checkInTime.setUTCHours(7, 0, 0, 0);
  return new Date() >= checkInTime;
};

const isCheckOutTime = (checkOutDate: string | null): boolean => {
  if (!checkOutDate) return false;
  const checkOutTime = new Date(checkOutDate);
  checkOutTime.setUTCHours(2, 0, 0, 0);
  return new Date() >= checkOutTime;
};

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
            Guest Details
          </h4>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
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
                <p className="font-medium text-gray-900">
                  {data.customer.name}
                </p>
                <p className="text-sm text-gray-500">{data.customer.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-medium text-gray-900">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            Reservation Details
          </h4>
          <div className="rounded-lg border p-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-medium text-gray-900">
                  {data.checkInDate
                    ? format(new Date(data.checkInDate), "EE, MMM dd yyyy")
                    : "Not set"}
                </p>
              </div>

              <Hotel className="h-5 w-5 rotate-90 text-gray-400 sm:rotate-0" />

              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-medium text-gray-900">
                  {data.checkOutDate
                    ? format(new Date(data.checkOutDate), "EE, MMM dd yyyy")
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-medium text-gray-900">
            <CreditCard className="h-4 w-4 text-blue-600" />
            Payment Method
          </h4>
          <div className="rounded-lg border p-4">
            <Badge
              variant="outline"
              className={`${
                data.paymentMethode === "MANUAL"
                  ? "border-orange-200 bg-orange-100 text-orange-700"
                  : "border-green-200 bg-green-100 text-green-700"
              }`}
            >
              {data.paymentMethode === "MANUAL"
                ? "Manual Payment"
                : "Automatic Payment"}
            </Badge>
          </div>
        </div>

        {firstReservation.roomFacilities.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-medium text-gray-900">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Room Facilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {firstReservation.roomFacilities.map((facility, index) => (
                <Badge key={index} variant="secondary">
                  {facility}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {data.paymentProof && !(data.paymentMethode === "OTOMATIS") && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Payment Proof
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Payment Proof</DialogTitle>
                </DialogHeader>
                <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={data.paymentProof}
                    alt="Payment Proof"
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {data.status === "WAITING_FOR_PAYMENT_CONFIRMATION" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="destructive"
              onClick={() => handleApproval(false)}
              disabled={approveTransaction.isPending}
              className="w-full sm:w-auto"
            >
              <X className="mr-2 h-4 w-4" />
              {approveTransaction.isPending
                ? "Processing..."
                : "Reject Payment"}
            </Button>
            <Button
              onClick={() => handleApproval(true)}
              disabled={approveTransaction.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
            >
              <Check className="mr-2 h-4 w-4" />
              {approveTransaction.isPending
                ? "Processing..."
                : "Approve Payment"}
            </Button>
          </div>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    disabled={isCancelling}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will cancel the customer's order. This cannot
                      be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isCancelling ? "Cancelling..." : "Yes, cancel order"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

        {(showCheckInButton || showCheckOutButton) && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {showCheckInButton && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
                    disabled={isCheckingIn}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {isCheckingIn ? "Processing..." : "Confirm Check-in"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Check-in</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to confirm customer check-in? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCheckIn}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      {isCheckingIn ? "Processing..." : "Yes, confirm check-in"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {showCheckOutButton && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 sm:w-auto"
                    disabled={isCheckingOut}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {isCheckingOut ? "Processing..." : "Confirm Check-out"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Check-out</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to confirm customer check-out? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCheckOut}
                      className="bg-orange-600 text-white hover:bg-orange-700"
                    >
                      {isCheckingOut
                        ? "Processing..."
                        : "Yes, confirm check-out"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionDetailTenantCard;
