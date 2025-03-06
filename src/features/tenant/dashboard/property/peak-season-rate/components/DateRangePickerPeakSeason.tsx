"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePickerWithRangeForPeakSeason({
  className,
  setFieldValue,
}: React.HTMLAttributes<HTMLDivElement> & {
  setFieldValue: (field: string, value: any) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  React.useEffect(() => {
    if (date?.from && date?.to) {
      setFieldValue("startDate", date.from);
      setFieldValue("endDate", date.to);
    }
  }, [date, setFieldValue]);

  // Calculate nights
  const nights = React.useMemo(() => {
    if (date?.from && date?.to) {
      return Math.ceil(
        (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24),
      );
    }
    return 0;
  }, [date]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Stay Duration
      </Label>
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "group relative h-12 w-full overflow-hidden rounded-lg border border-gray-200 bg-white px-4 text-left font-normal shadow-sm transition-all hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800",
                !date && "text-muted-foreground",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date?.from ? (
                    date.to ? (
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {format(date.from, "LLL dd, y")} —{" "}
                        {format(date.to, "LLL dd, y")}
                      </span>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span className="text-sm text-gray-500">
                      Select check-in and check-out dates
                    </span>
                  )}
                </div>

                {nights > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {nights} night{nights !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden rounded-lg border-none p-0 shadow-xl"
            align="start"
          >
            <div className="border-b bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Select Peak Season Dates
              </h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Define the period when special rates will apply
              </p>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={{ before: new Date() }}
              className="rounded-b-lg p-3"
              classNames={{
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today:
                  "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
                day_outside: "text-gray-300 opacity-50 dark:text-gray-600",
                day_range_middle:
                  "aria-selected:bg-primary/20 dark:aria-selected:bg-primary/30",
                nav_button:
                  "border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
                caption: "text-sm font-medium text-gray-900 dark:text-gray-100",
              }}
            />
            <div className="flex items-center justify-between border-t bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
              <div>
                {date?.from && date?.to && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {nights} night{nights !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                className="h-8 rounded-full px-3 text-xs"
                onClick={() => {
                  document.dispatchEvent(
                    new KeyboardEvent("keydown", { key: "Escape" }),
                  );
                }}
              >
                Apply Dates
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
