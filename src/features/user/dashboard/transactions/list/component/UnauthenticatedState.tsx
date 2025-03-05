import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const UnauthenticatedState = () => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-xl bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Please login to view your bookings
      </h2>
      <p className="text-center text-gray-600">
        Sign in to access your booking history and manage your reservations.
      </p>
      <Button
        onClick={() => signIn()}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Login
      </Button>
    </div>
  );
};

export default UnauthenticatedState;
