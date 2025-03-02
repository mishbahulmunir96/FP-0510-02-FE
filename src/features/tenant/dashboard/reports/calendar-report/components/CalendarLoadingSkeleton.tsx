import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const CalendarLoadingSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm dark:border-gray-800">
      <CardHeader className="border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex flex-col gap-4">
          <div className="h-7 w-1/3 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex justify-end">
            <div className="flex space-x-2">
              <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-8 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={`header-${i}`}
                className="h-8 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"
              ></div>
            ))}

            {[...Array(35)].map((_, i) => (
              <div
                key={`cell-${i}`}
                className="h-32 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800/50"
              ></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarLoadingSkeleton;
