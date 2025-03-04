import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

export const CalendarLoadingSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-md dark:border-gray-800">
      <CardHeader className="border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="h-7 w-1/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex space-x-3">
              <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-5">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-8 w-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex space-x-3">
              <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={`header-${i}`}
                className="h-10 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"
              ></div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {[...Array(35)].map((_, i) => (
              <div
                key={`cell-${i}`}
                className="relative h-32 animate-pulse overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800/50"
              >
                <div className="absolute left-2 top-2 h-5 w-5 rounded bg-gray-200 dark:bg-gray-700"></div>

                <div className="absolute left-2 right-2 top-10 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="mt-4 h-5 w-4/5 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarLoadingSkeleton;
