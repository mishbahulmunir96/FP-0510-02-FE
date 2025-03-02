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

export function DatePickerWithRangeForRoomNonAvailability({
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

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Stay Duration</Label>
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "h-12 w-full justify-between rounded-lg border-gray-300 text-left font-normal shadow-sm transition-all hover:border-primary hover:bg-gray-50 md:w-auto",
                !date && "text-muted-foreground",
              )}
            >
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {date?.from ? (
                  date.to ? (
                    <span className="text-sm">
                      {format(date.from, "LLL dd, y")} —{" "}
                      {format(date.to, "LLL dd, y")}
                    </span>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span className="text-gray-500">
                    Select check-in and check-out dates
                  </span>
                )}
              </div>
              <span className="hidden text-xs text-gray-500 md:inline">
                {date?.from &&
                  date?.to &&
                  `${Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))} night${
                    Math.ceil(
                      (date.to.getTime() - date.from.getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) !== 1
                      ? "s"
                      : ""
                  }`}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto rounded-lg border-none p-0 shadow-lg"
            align="start"
          >
            <div className="rounded-t-lg border-b bg-white p-3">
              <h4 className="text-sm font-medium text-gray-900">
                Select your dates
              </h4>
              <p className="text-xs text-gray-500">
                Pick check-in and check-out dates
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
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-gray-100 text-gray-900",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
