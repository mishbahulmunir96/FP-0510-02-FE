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
import { Clock, Loader2 } from "lucide-react";

interface CheckInOutActionsProps {
  showCheckInButton: boolean;
  showCheckOutButton: boolean;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
}

const CheckInOutActions = ({
  showCheckInButton,
  showCheckOutButton,
  isCheckingIn,
  isCheckingOut,
  onCheckIn,
  onCheckOut,
}: CheckInOutActionsProps) => {
  if (!showCheckInButton && !showCheckOutButton) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      {showCheckInButton && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
              disabled={isCheckingIn}
            >
              <Clock className="mr-2 h-4 w-4" />
              {isCheckingIn ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span className="ml-2">Processing</span>
                </>
              ) : (
                "Confirm Check-in"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Check-in</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to confirm customer check-in? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onCheckIn}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isCheckingIn ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  "Yes, confirm check-in"
                )}
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
              {isCheckingOut ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                "Confirm Check-out"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Check-out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to confirm customer check-out? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onCheckOut}
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  "Yes, confirm check-out"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default CheckInOutActions;
