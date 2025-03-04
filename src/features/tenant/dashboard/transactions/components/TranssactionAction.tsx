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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Eye, Loader2, X } from "lucide-react";
import Image from "next/image";

interface PaymentProofViewProps {
  paymentProof: string;
}

export const PaymentProofView = ({ paymentProof }: PaymentProofViewProps) => {
  return (
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
            src={paymentProof}
            alt="Payment Proof"
            fill
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PaymentConfirmationActionsProps {
  isPending: boolean;
  onReject: () => void;
  onApprove: () => void;
}

export const PaymentConfirmationActions = ({
  isPending,
  onReject,
  onApprove,
}: PaymentConfirmationActionsProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                <span className="ml-2">Processing</span>
              </>
            ) : (
              "Reject Payment"
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this payment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                "Yes, reject payment"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
            disabled={isPending}
          >
            <Check className="mr-2 h-4 w-4" />
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              "Approve Payment"
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this payment? This will confirm
              the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onApprove}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                "Yes, approve payment"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
