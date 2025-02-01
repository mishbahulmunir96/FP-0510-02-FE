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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CreditCard, Eye, Upload, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TransactionPaymentSectionProps {
  paymentMethode: string;
  paymentProof: string | null;
  status: string;
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
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCancelOrder = () => {
    onCancelTransaction();
    setShowCancelDialog(false);
  };

  return (
    <div className="border-t pt-4">
      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <span className="font-medium">Payment Method:</span>
        <span>{paymentMethode}</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label
              htmlFor="payment-proof"
              className={`cursor-pointer ${isUploadDisabled ? "opacity-50" : ""}`}
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

        {(previewUrl || paymentProof) && (
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
                  src={previewUrl || paymentProof || "/placeholder.svg"}
                  alt="Payment Proof"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

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
          <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4" />
            This order has been cancelled
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPaymentSection;
