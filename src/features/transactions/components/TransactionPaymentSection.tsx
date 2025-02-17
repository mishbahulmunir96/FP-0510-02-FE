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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethod, TransactionStatus } from "@/types/transaction";
import { AlertCircle, CreditCard, Eye, Upload, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TransactionPaymentSectionProps {
  paymentMethode: PaymentMethod;
  paymentProof: string | null;
  status: TransactionStatus;
  isUploadDisabled: boolean;
  isCancelDisabled: boolean;
  isUploading: boolean;
  isCancelling: boolean;
  onUploadProof: (file: File) => void;
  onCancelTransaction: () => void;
}

const TransactionPaymentSection = ({
  paymentMethode,
  paymentProof,
  status,
  isUploadDisabled,
  isCancelDisabled,
  isUploading,
  isCancelling,
  onUploadProof,
  onCancelTransaction,
}: TransactionPaymentSectionProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

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

  const handleUpload = () => {
    if (!selectedFile) return;
    onUploadProof(selectedFile);
  };

  const handleCancelOrder = () => {
    onCancelTransaction();
    setShowCancelDialog(false);
  };

  return (
    <div className="space-y-4 rounded-lg border bg-gray-50/50 p-4">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-gray-900">Payment Method:</span>
        <span className="text-gray-600">{paymentMethode}</span>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Label
              htmlFor="payment-proof"
              className={`block ${isUploadDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-3 transition-colors hover:bg-gray-50">
                <Upload className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
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

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploadDisabled || isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Uploading...</span>
              </div>
            ) : (
              "Submit Proof"
            )}
          </Button>
        </div>

        {(previewUrl || paymentProof) && paymentMethode !== "OTOMATIS" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreviewDialog(true)}
            className="w-full sm:w-auto"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Payment Proof
          </Button>
        )}

        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Proof</DialogTitle>
            </DialogHeader>
            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={previewUrl || paymentProof || "/placeholder.svg"}
                alt="Payment Proof"
                fill
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Order</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCancelling}>
                No, keep order
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

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setShowCancelDialog(true)}
          disabled={isCancelDisabled}
        >
          <XCircle className="mr-2 h-4 w-4" />
          {isCancelling ? "Cancelling..." : "Cancel Order"}
        </Button>

        {status === "CANCELLED" && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            This order has been cancelled
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPaymentSection;
