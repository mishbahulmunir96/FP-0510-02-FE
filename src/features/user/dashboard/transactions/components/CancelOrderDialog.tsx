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
import { Loader2 } from "lucide-react";

interface CancelOrderDialogProps {
  showCancelDialog: boolean;
  setShowCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isCancelling: boolean;
  handleCancelOrder: () => void;
}

const CancelOrderDialog = ({
  showCancelDialog,
  setShowCancelDialog,
  isCancelling,
  handleCancelOrder,
}: CancelOrderDialogProps) => {
  return (
    <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this order? This action cannot be
            undone.
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
              <>
                <Loader2 className="animate-spin" />
                <span className="ml-2">Cancelling...</span>
              </>
            ) : (
              "Yes, cancel order"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelOrderDialog;
