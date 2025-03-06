import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Mail } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  email: string;
  isLoading: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  email,
  isLoading,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <AlertCircle className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">
            Confirm Registration
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Email Verification Required
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>We will send a verification email to:</p>
                  <p className="mt-1 font-mono font-medium">{email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>By clicking confirm:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>A verification email will be sent to your address</li>
              <li>You'll need to verify your email within 1 hour</li>
              <li>You'll set your password after verification</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full bg-sky-600 hover:bg-sky-700 sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Confirm Registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
