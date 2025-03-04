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
import { Loader2, X } from "lucide-react";

interface CancelOrderActionProps {
  isCancelling: boolean;
  onCancel: () => void;
}

const CancelOrderAction = ({
  isCancelling,
  onCancel,
}: CancelOrderActionProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <Loader2 className="animate-spin" />
                <span className="ml-2">Cancelling...</span>
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel Order
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will cancel the customer's order. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
    </div>
  );
};

export default CancelOrderAction;
