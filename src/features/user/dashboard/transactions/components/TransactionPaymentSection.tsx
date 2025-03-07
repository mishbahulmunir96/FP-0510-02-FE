import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethod, TransactionStatus } from "@/types/transaction";
import {
  AlertCircle,
  CreditCard,
  Loader2,
  Upload,
  Wallet,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import PaymentProofPreview from "./PaymentProofPreview";
import CancelOrderDialog from "./CancelOrderDialog";
import BankAccountInfo from "./BankAccountInfo";

interface BankAccount {
  bankName: string;
  bankNumber: string;
  name: string;
}

interface TransactionPaymentSectionProps {
  paymentMethode: PaymentMethod;
  paymentProof: string | null;
  status: TransactionStatus;
  isUploadDisabled: boolean;
  isCancelDisabled: boolean;
  isUploading: boolean;
  isCancelling: boolean;
  invoiceUrl: string | null;
  bankAccount?: BankAccount | null;
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
  invoiceUrl,
  bankAccount,
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

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    const fileInput = document.getElementById(
      "payment-proof",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleCancelOrder = () => {
    onCancelTransaction();
    setShowCancelDialog(false);
  };

  const getPreviewButtonText = () => {
    if (selectedFile && !paymentProof) {
      return "View Preview Payment Proof";
    }
    return "View Payment Proof";
  };

  return (
    <div className="space-y-4 rounded-lg border bg-gray-50/50 p-4">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-gray-900">Payment Method:</span>
        <span className="text-gray-600">{paymentMethode}</span>
      </div>

      {status === "WAITING_FOR_PAYMENT" &&
        paymentMethode === "MANUAL" &&
        bankAccount && <BankAccountInfo bankAccount={bankAccount} />}

      <div className="space-y-4">
        {paymentMethode === "OTOMATIS" &&
          status === "WAITING_FOR_PAYMENT" &&
          invoiceUrl && (
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
                <CreditCard className="mr-2 h-4 w-4" />
                Complete Payment
              </a>
            </Button>
          )}

        {paymentMethode === "MANUAL" && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Label
                htmlFor="payment-proof"
                className={`block ${
                  isUploadDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
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

            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploadDisabled || isUploading}
                className="w-full sm:w-auto"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span className="ml-2">Uploading...</span>
                  </>
                ) : (
                  "Submit Proof"
                )}
              </Button>
            </div>
          </div>
        )}

        {(previewUrl || paymentProof) && paymentMethode === "MANUAL" && (
          <PaymentProofPreview
            previewUrl={previewUrl}
            paymentProof={paymentProof}
            selectedFile={selectedFile}
            showPreviewDialog={showPreviewDialog}
            setShowPreviewDialog={setShowPreviewDialog}
            getPreviewButtonText={getPreviewButtonText}
            handleRemovePreview={handleRemovePreview}
          />
        )}

        <CancelOrderDialog
          showCancelDialog={showCancelDialog}
          setShowCancelDialog={setShowCancelDialog}
          isCancelling={isCancelling}
          handleCancelOrder={handleCancelOrder}
        />

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setShowCancelDialog(true)}
          disabled={isCancelDisabled}
        >
          <XCircle className="mr-2 h-4 w-4" />
          {isCancelling ? (
            <>
              <Loader2 className="animate-spin" />
              <span className="ml-2">Cancelling...</span>
            </>
          ) : (
            "Cancel Order"
          )}
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
