import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, XCircle } from "lucide-react";
import Image from "next/image";

interface PaymentProofPreviewProps {
  previewUrl: string | null;
  paymentProof: string | null;
  selectedFile: File | null;
  showPreviewDialog: boolean;
  setShowPreviewDialog: React.Dispatch<React.SetStateAction<boolean>>;
  getPreviewButtonText: () => string;
  handleRemovePreview: () => void;
}

const PaymentProofPreview = ({
  previewUrl,
  paymentProof,
  selectedFile,
  showPreviewDialog,
  setShowPreviewDialog,
  getPreviewButtonText,
  handleRemovePreview,
}: PaymentProofPreviewProps) => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPreviewDialog(true)}
        className="w-full sm:w-auto"
      >
        <Eye className="mr-2 h-4 w-4" />
        {getPreviewButtonText()}
      </Button>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedFile && !paymentProof
                ? "Preview Payment Proof"
                : "Payment Proof"}
            </DialogTitle>
          </DialogHeader>
          <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={previewUrl || paymentProof || "/placeholder.svg"}
              alt="Payment Proof"
              fill
              className="object-contain"
            />
          </div>
          {selectedFile && !paymentProof && (
            <div className="mt-4 flex justify-end">
              <p>Wrong image selection?</p>
              <Button
                onClick={() => {
                  handleRemovePreview();
                  setShowPreviewDialog(false);
                }}
                variant="destructive"
                size="sm"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Remove Payment Proof
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentProofPreview;
