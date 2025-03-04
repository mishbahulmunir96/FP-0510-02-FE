import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorCalendarCardProps {
  onRetry?: () => void;
}

const ErrorCalendarCard: React.FC<ErrorCalendarCardProps> = ({ onRetry }) => {
  return (
    <Card className="overflow-hidden border-gray-200 p-6 shadow-sm dark:border-gray-800">
      <CardContent className="flex h-[400px] items-center justify-center p-0">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mb-6 inline-block rounded-full bg-red-50 p-5 dark:bg-red-900/20">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Error Loading Data
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            There was a problem retrieving calendar data. Please try again later
            or contact support if the issue persists.
          </p>
          <Button
            onClick={onRetry || (() => window.location.reload())}
            className="gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Retry</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorCalendarCard;
