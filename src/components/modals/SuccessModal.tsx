// components/modals/SuccessModal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, email, onClose }: SuccessModalProps) => {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">
            Account Created Successfully!
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
                  Verification Email Sent
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>We've sent an email to:</p>
                  <p className="mt-1 font-mono font-medium">{email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-base font-medium text-gray-900">Next steps:</h4>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  1
                </span>
                <p className="ml-3 text-sm text-gray-600">
                  Check your email inbox (and spam folder)
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  2
                </span>
                <p className="ml-3 text-sm text-gray-600">
                  Click the verification link
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  3
                </span>
                <p className="ml-3 text-sm text-gray-600">
                  Set your account password
                </p>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex items-center space-x-2 rounded-md bg-yellow-50 px-3 py-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-700">
              Verification link expires in 1 hour
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button
            onClick={handleGoToLogin}
            className="w-full bg-sky-600 hover:bg-sky-700 sm:w-auto"
          >
            Go to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
