import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  errorMessage?: string;
}

const ErrorState = ({ errorMessage }: ErrorStateProps) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-xl bg-white p-8 shadow-sm">
      <div className="rounded-full bg-red-50 p-3">
        <svg
          className="h-6 w-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900">
        Something went wrong
      </h2>
      <p className="text-center text-gray-600">{errorMessage}</p>
      <Button
        onClick={() => window.location.reload()}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
