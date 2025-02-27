"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoomCalendar from "@/hooks/api/calendar/useRoomCalendar";
import { cn } from "@/lib/utils";
import {
  formatLocalDate,
  standardizeToCheckInTime,
  standardizeToCheckOutTime,
} from "@/utils/date";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import * as React from "react";
import { DayButtonProps } from "react-day-picker";

// Threshold for determining "good price" (less than base price)
const GOOD_PRICE_THRESHOLD_RATIO = 0.9;

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

interface Room {
  id: number;
  type: string;
  price: number;
  guest: number;
}

interface RoomPriceCalendarProps {
  rooms: Room[];
  onRoomSelect: (roomId: string) => void;
  selectedRoomId: string;
  onDateChange: (dateRange: DateRange) => void;
  dateRange: DateRange;
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const disabledDays = [{ before: today }]; // This is used by the Calendar component internally

const TIMEZONE = "Asia/Jakarta";

// Custom DayButton component with improved styling
function DayButton(
  props: DayButtonProps & {
    calendarData?: any;
    basePrice?: number;
    isPeakSeason?: Record<string, boolean>;
  },
) {
  const {
    day,
    modifiers,
    calendarData,
    basePrice,
    isPeakSeason,
    ...buttonProps
  } = props;

  if (!calendarData || !basePrice) {
    return <button {...buttonProps}>{props.children}</button>;
  }

  const dateKey = format(day.date, "yyyy-MM-dd");
  const dayData = calendarData[dateKey];

  if (!dayData) {
    return <button {...buttonProps}>{props.children}</button>;
  }

  const price = dayData.price;
  const isGoodPrice = price < basePrice * GOOD_PRICE_THRESHOLD_RATIO;
  const isPeak = isPeakSeason?.[dateKey] || false;

  // Format price to IDR
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("Rp", "");

  return (
    <button
      {...buttonProps}
      className={cn(
        buttonProps.className,
        isPeak && "rounded-md border-2 border-yellow-400",
        "p-0 transition-all duration-200 hover:scale-105",
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <span className="font-medium">{props.children}</span>
        {price && (
          <span
            className={cn(
              "text-[9px] font-medium",
              isGoodPrice
                ? "text-emerald-600"
                : price > basePrice * 1.1
                  ? "text-red-600"
                  : "text-slate-500",
            )}
          >
            {formattedPrice}
          </span>
        )}
        {dayData && (
          <span className="text-[7px] leading-tight">
            {dayData.isAvailable ? (
              <span className="text-slate-500">
                {dayData.availableStock} left
              </span>
            ) : (
              <span className="font-semibold text-red-500">Sold out</span>
            )}
          </span>
        )}
      </div>
    </button>
  );
}

export function RoomPriceCalendar({
  rooms,
  onRoomSelect,
  selectedRoomId,
  onDateChange,
  dateRange,
}: RoomPriceCalendarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  // Fetch room calendar data if a room is selected
  const { data: calendarData, isLoading } = useRoomCalendar(
    selectedRoomId ? parseInt(selectedRoomId) : 0,
    currentMonth,
    { enabled: !!selectedRoomId },
  );

  const handleDateSelect = (newDateRange: DateRange | undefined) => {
    if (!newDateRange) {
      onDateChange({ from: undefined, to: undefined });
      return;
    }

    let { from, to } = newDateRange;

    // Get current date for validation
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset to start of day

    // Apply timezone and standardize times
    if (from) {
      // Ensure check-in date is not in the past
      if (from < currentDate) {
        from = currentDate;
      }
      const zonedFrom = toZonedTime(from, TIMEZONE);
      from = standardizeToCheckInTime(zonedFrom);
    }

    if (to) {
      // Ensure check-out date is not in the past
      if (to < currentDate) {
        to = currentDate;
      }
      const zonedTo = toZonedTime(to, TIMEZONE);
      to = standardizeToCheckOutTime(zonedTo);
    }

    // Additional validation to ensure proper date sequence
    if (from && to) {
      if (from > to) {
        // If check-in is after check-out, clear the check-out date
        onDateChange({ from, to: undefined });
        return;
      }
    }

    onDateChange({ from, to });
  };

  const buttonClasses = (date: Date | undefined) =>
    cn("w-full justify-start text-left font-normal", !date && "text-slate-400");

  // Create isPeakSeason map for easy lookup
  const isPeakSeason: Record<string, boolean> = {};

  if (calendarData?.data?.calendar) {
    Object.entries(calendarData.data.calendar).forEach(([dateKey, data]) => {
      isPeakSeason[dateKey] = (data as any).isPeakSeason || false;
    });
  }

  const isDateDisabled = (date: Date) => {
    // First check if the date is in the past (before today)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset to start of day for proper comparison

    if (date < currentDate) {
      return true; // Disable past dates
    }

    // Then check availability from the calendar data
    if (!calendarData?.data?.calendar) return false;

    const dateKey = format(date, "yyyy-MM-dd");
    const dayData = calendarData.data.calendar[dateKey];

    return dayData ? !dayData.isAvailable : false;
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none text-slate-700">
          Select Room Type
        </label>
        <Select onValueChange={onRoomSelect} value={selectedRoomId}>
          <SelectTrigger className="border-slate-200 bg-white shadow-sm transition-colors hover:border-slate-300">
            <SelectValue placeholder="Select a room type" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id.toString()}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{room.type}</span>
                  <span className="text-slate-500">
                    Rp {room.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="flex w-full justify-between divide-x rounded-lg border border-slate-200 bg-white shadow-sm transition-colors hover:border-slate-300">
              <div
                className={`${buttonClasses(
                  dateRange.from,
                )} flex h-full cursor-pointer flex-col gap-1 p-3 transition-colors hover:bg-slate-50`}
                onClick={() => setIsOpen(true)}
                aria-label="Select check-in date"
              >
                <span className="text-xs font-semibold text-slate-700">
                  CHECK-IN (14:00)
                </span>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                  <span
                    className={
                      dateRange.from ? "text-slate-900" : "text-slate-400"
                    }
                  >
                    {dateRange.from
                      ? formatLocalDate(dateRange.from)
                      : "DD/MM/YYYY"}
                  </span>
                </div>
              </div>

              <div
                className={`${buttonClasses(
                  dateRange.to,
                )} flex h-full cursor-pointer flex-col gap-1 p-3 transition-colors hover:bg-slate-50`}
                onClick={() => setIsOpen(true)}
                aria-label="Select check-out date"
              >
                <span className="text-xs font-semibold text-slate-700">
                  CHECK-OUT (12:00)
                </span>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                  <span
                    className={
                      dateRange.to ? "text-slate-900" : "text-slate-400"
                    }
                  >
                    {dateRange.to
                      ? formatLocalDate(dateRange.to)
                      : "DD/MM/YYYY"}
                  </span>
                </div>
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto rounded-lg border-slate-200 p-0 shadow-lg"
            align="start"
          >
            <div className="flex flex-col">
              {selectedRoomId && (
                <div className="flex items-center border-b bg-slate-50 p-3 text-xs">
                  <Info className="mr-2 h-4 w-4 text-blue-500" />
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-sm bg-emerald-500 opacity-70"></div>
                      <span className="text-slate-700">Lower price</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-sm bg-red-500 opacity-70"></div>
                      <span className="text-slate-700">Higher price</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-sm border-2 border-yellow-400"></div>
                      <span className="text-slate-700">Peak season</span>
                    </div>
                  </div>
                </div>
              )}

              <Calendar
                mode="range"
                defaultMonth={dateRange.from || new Date()}
                selected={dateRange}
                onSelect={handleDateSelect}
                numberOfMonths={1}
                showOutsideDays={false}
                initialFocus
                disabled={isDateDisabled}
                onMonthChange={setCurrentMonth}
                components={{
                  DayButton: (props: DayButtonProps) => (
                    <DayButton
                      {...props}
                      calendarData={calendarData?.data?.calendar}
                      basePrice={calendarData?.data?.basePrice}
                      isPeakSeason={isPeakSeason}
                    />
                  ),
                }}
                classNames={{
                  months: "flex flex-col space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-2 relative items-center",
                  caption_label: "text-sm font-medium text-slate-800",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-7 w-7 bg-transparent p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-slate-500 rounded-md w-10 font-medium text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors",
                  day_selected:
                    "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white rounded-md",
                  day_today: "bg-slate-100 text-slate-900 font-medium",
                  day_outside: "text-slate-400 opacity-50",
                  day_disabled: "text-slate-400 opacity-50",
                  day_range_middle:
                    "aria-selected:bg-slate-100 aria-selected:text-slate-900",
                  day_hidden: "invisible",
                  day_button: "h-10 w-10 p-0 font-normal",
                }}
              />

              <div className="flex items-center justify-end gap-2 border-t bg-slate-50 p-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    onDateChange({
                      from: undefined,
                      to: undefined,
                    });
                  }}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading && selectedRoomId && (
        <div className="animate-pulse text-xs text-slate-500">
          Loading pricing data...
        </div>
      )}
    </div>
  );
}
