"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCancelTransaction from "@/hooks/api/transaction/useCancelTransaction";
import useGetTransactionByUser from "@/hooks/api/transaction/useGetTransactionByUser";
import useUploadPaymentProof from "@/hooks/api/transaction/useUploadPaymentProof";
import { format } from "date-fns";
import {
  AlertCircle,
  CreditCard,
  Eye,
  Hotel,
  MapPin,
  Upload,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";

interface TransactionDetailPageProps {
  transactionId: number;
}

const TransactionDetailPage: FC<TransactionDetailPageProps> = ({
  transactionId,
}) => {
  const { data, isPending } = useGetTransactionByUser(transactionId);
  const { mutate: uploadProof, isPending: isUploading } =
    useUploadPaymentProof();
  const { mutate: cancelTransaction, isPending: isCancelling } =
    useCancelTransaction();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadProof(
      {
        transactionId,
        paymentProof: selectedFile,
      },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setPreviewUrl(null);
        },
      },
    );
  };

  const handleCancelOrder = () => {
    cancelTransaction(transactionId);
    setShowCancelDialog(false);
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) return null;

  const isUploadDisabled =
    data.status === "CANCELLED" ||
    data.status === "PROCESSED" ||
    data.status === "WAITING_FOR_PAYMENT_CONFIRMATION";

  const isCancelDisabled =
    data.status !== "WAITING_FOR_PAYMENT" || isCancelling;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING_FOR_PAYMENT":
        return "bg-yellow-100 text-yellow-800";
      case "WAITING_FOR_PAYMENT_CONFIRMATION":
        return "bg-blue-100 text-blue-800";
      case "PROCESSED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="flex justify-between px-16">
      <div className="flex w-3/5 flex-col gap-4">
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
                    ? format(new Date(data.checkOutDate), "EE, MMM dd yy")
                    : "No Check-out Date"}
                </p>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="border-t pt-4">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Payment Method:</span>
                <span>{data.paymentMethode}</span>
              </div>

              {/* Payment Proof Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label
                      htmlFor="payment-proof"
                      className={`cursor-pointer ${
                        isUploadDisabled ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 rounded-lg border-2 border-dashed p-2 hover:bg-secondary">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">
                          {isUploadDisabled
                            ? "Upload not available"
                            : "Upload Payment Proof"}
                        </span>
                      </div>
                    </Label>
                    <Input
                      id="payment-proof"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploadDisabled}
                    />
                  </div>

                  {selectedFile && !isUploadDisabled && (
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-32"
                    >
                      {isUploading ? "Uploading..." : "Submit Proof"}
                    </Button>
                  )}
                </div>

                {/* View Payment Proof Dialog */}
                {(previewUrl || data.paymentProof) && (
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
                          src={
                            previewUrl ||
                            data.paymentProof ||
                            "/placeholder.svg"
                          }
                          alt="Payment Proof"
                          width={400}
                          height={300}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Cancel Order Dialog */}
                <AlertDialog
                  open={showCancelDialog}
                  onOpenChange={setShowCancelDialog}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this order? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isCancelling}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {isCancelling ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Cancelling...
                          </div>
                        ) : (
                          "Yes, cancel order"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Cancel Order Button */}
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isCancelDisabled}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </Button>

                {/* Status Info */}
                {data.status === "CANCELLED" && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    This order has been cancelled
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-sm">
                {data.duration} Night
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm ${getStatusColor(
                  data.status,
                )}`}
              >
                {data.status}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-3 p-4">
          <div className="relative h-40 w-full overflow-hidden rounded-lg">
            <Image
              src="/images/room.avif"
              alt={`${data.reservations[0].propertyTitle}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              CVK Park Bosphorus...
            </div>
            <h3 className="font-medium">
              {data.reservations[0].roomType} Room - Include{" "}
              {data.reservations[0].roomFacilities[0]}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="rounded bg-green-600 px-1.5 py-0.5 text-sm font-medium text-white">
                  4.2
                </span>
                <span className="text-sm font-medium">Very Good</span>
              </div>
              <span className="text-sm text-muted-foreground">54 reviews</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-2 text-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="#5C3EBA"
              />
              <path
                d="M7.99995 12.0001L10.6666 14.6667L16 9.33341"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Your booking is protected by PhonePe
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Price Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Price</span>
                <span>
                  {data.reservations[0].roomPrice.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Peak Price</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between">
                <span>stay</span>
                <span>{data.duration} nights</span>
              </div>
              <div className="flex justify-between">
                <span>Day of peak season</span>
                <span>0</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-medium">
                <span>Total</span>
                <span>
                  {data.totalPrice.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default TransactionDetailPage;
