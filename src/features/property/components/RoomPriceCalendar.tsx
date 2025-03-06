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
import { CalendarIcon, CreditCard, Info } from "lucide-react";
import * as React from "react";
import type { DayButtonProps } from "react-day-picker";

const GOOD_PRICE_THRESHOLD_RATIO = 0.9;

const formatCompactPrice = (price: number) => {
  if (price >= 1_000_000) {
    return `${Math.round(price / 1_000_000)}M`;
  } else if (price >= 1_000) {
    return `${Math.round(price / 1_000)}k`;
  }
  return `${price}`;
};

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
  onTotalPriceChange?: (totalPrice: number | null) => void;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const TIMEZONE = "Asia/Jakarta";

const calculateNights = (checkIn: Date, checkOut: Date) => {
  const from = new Date(checkIn);
  const to = new Date(checkOut);

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  const diffTime = to.getTime() - from.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const DayButton = (
  props: DayButtonProps & {
    calendarData?: any;
    basePrice?: number;
    isPeakSeason?: Record<string, boolean>;
  },
) => {
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
  const isSoldOut = !dayData.isAvailable;

  return (
    <button
      {...buttonProps}
      className={cn(
        buttonProps.className,
        isPeak && "rounded-md border border-amber-400 bg-amber-50/50",
        isSoldOut && "cursor-not-allowed bg-rose-100 opacity-70",
        "p-0 transition-all duration-300 hover:scale-105 hover:shadow-sm",
      )}
      disabled={isSoldOut}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <span
          className={cn(
            "font-medium",
            isSoldOut && "text-rose-700 line-through",
          )}
        >
          {props.children}
        </span>
        {price && (
          <span
            className={cn(
              "text-[10px] font-medium",
              isGoodPrice
                ? "text-emerald-600"
                : price > basePrice * 1.1
                  ? "text-rose-600"
                  : "text-slate-600",
              isSoldOut && "text-rose-700",
            )}
          >
            {formatCompactPrice(price)}
          </span>
        )}
        {dayData && (
          <span className="mt-0.5 block text-[8px] leading-tight">
            {dayData.isAvailable ? (
              <span className="rounded-sm bg-slate-100 px-1 py-0.5 text-slate-600">
                {dayData.availableStock} left
              </span>
            ) : (
              <span className="rounded-sm bg-rose-200 px-1 py-0.5 font-semibold text-rose-700">
                Sold out
              </span>
            )}
          </span>
        )}
      </div>
    </button>
  );
};

export function RoomPriceCalendar({
  rooms,
  onRoomSelect,
  selectedRoomId,
  onDateChange,
  dateRange,
  onTotalPriceChange,
}: RoomPriceCalendarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [totalPrice, setTotalPrice] = React.useState<number | null>(null);
  const [nightlyPrices, setNightlyPrices] = React.useState<{
    [key: string]: number;
  }>({});
  const [hasUnavailableDates, setHasUnavailableDates] = React.useState(false);

  const { data: calendarData, isLoading } = useRoomCalendar(
    selectedRoomId ? Number.parseInt(selectedRoomId) : 0,
    currentMonth,
    { enabled: !!selectedRoomId },
  );

  React.useEffect(() => {
    if (
      dateRange.from &&
      dateRange.to &&
      calendarData?.data?.calendar &&
      selectedRoomId
    ) {
      let total = 0;
      const prices: { [key: string]: number } = {};
      let unavailableDatesDetected = false;

      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);
      const days = calculateNights(startDate, endDate);

      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateKey = format(currentDate, "yyyy-MM-dd");

        if (calendarData.data.calendar[dateKey]) {
          const dayData = calendarData.data.calendar[dateKey];
          if (!dayData.isAvailable) {
            unavailableDatesDetected = true;
            break;
          }

          const dayPrice = dayData.price;
          total += dayPrice;
          prices[dateKey] = dayPrice;
        } else {
          total += calendarData.data.basePrice;
          prices[dateKey] = calendarData.data.basePrice;
        }
      }

      setHasUnavailableDates(unavailableDatesDetected);

      if (unavailableDatesDetected) {
        setTotalPrice(null);
        setNightlyPrices({});

        if (onTotalPriceChange) {
          onTotalPriceChange(null);
        }
      } else {
        setTotalPrice(total);
        setNightlyPrices(prices);

        if (onTotalPriceChange) {
          onTotalPriceChange(total);
        }
      }
    } else {
      setHasUnavailableDates(false);
      setTotalPrice(null);
      setNightlyPrices({});

      if (onTotalPriceChange) {
        onTotalPriceChange(null);
      }
    }
  }, [dateRange, calendarData, selectedRoomId, onTotalPriceChange]);

  const handleDateSelect = (newDateRange: DateRange | undefined) => {
    if (!newDateRange) {
      onDateChange({ from: undefined, to: undefined });
      return;
    }

    let { from, to } = newDateRange;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (from) {
      if (from < currentDate) {
        from = currentDate;
      }
      const zonedFrom = toZonedTime(from, TIMEZONE);
      from = standardizeToCheckInTime(zonedFrom);
    }

    if (to) {
      if (to < currentDate) {
        to = currentDate;
      }
      const zonedTo = toZonedTime(to, TIMEZONE);
      to = standardizeToCheckOutTime(zonedTo);
    }

    if (from && to) {
      if (from > to) {
        onDateChange({ from, to: undefined });
        return;
      }

      if (calendarData?.data?.calendar) {
        const startDate = new Date(from);
        const endDate = new Date(to);

        const currentDateCheck = new Date(startDate);
        while (currentDateCheck < endDate) {
          const dateKey = format(currentDateCheck, "yyyy-MM-dd");
          const dayData = calendarData.data.calendar[dateKey];

          if (dayData && !dayData.isAvailable) {
            const prevDate = new Date(currentDateCheck);
            prevDate.setDate(prevDate.getDate() - 1);
            if (prevDate >= from) {
              onDateChange({ from, to: prevDate });
            } else {
              onDateChange({ from, to: undefined });
            }
            alert(
              `Sorry, the date ${format(currentDateCheck, "MM/dd/yyyy")} is not available for booking.`,
            );
            return;
          }
          currentDateCheck.setDate(currentDateCheck.getDate() + 1);
        }
      }
    }

    onDateChange({ from, to });
  };

  const buttonClasses = (date: Date | undefined) =>
    cn("w-full justify-start text-left font-normal", !date && "text-slate-400");

  const isPeakSeason: Record<string, boolean> = {};

  if (calendarData?.data?.calendar) {
    Object.entries(calendarData.data.calendar).forEach(([dateKey, data]) => {
      isPeakSeason[dateKey] = (data as any).isPeakSeason || false;
    });
  }

  const isDateDisabled = (date: Date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (date < currentDate) {
      return true;
    }

    if (!calendarData?.data?.calendar) return false;

    const dateKey = format(date, "yyyy-MM-dd");
    const dayData = calendarData.data.calendar[dateKey];

    return dayData ? !dayData.isAvailable : false;
  };

  const selectedRoom = rooms.find(
    (room) => room.id.toString() === selectedRoomId,
  );

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "");
  };

  const nights =
    dateRange.from && dateRange.to
      ? calculateNights(dateRange.from, dateRange.to)
      : 0;

  const checkUnavailableDatesInRange = () => {
    if (!dateRange.from || !dateRange.to || !calendarData?.data?.calendar) {
      return false;
    }

    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    const currentDateCheck = new Date(startDate);
    while (currentDateCheck < endDate) {
      const dateKey = format(currentDateCheck, "yyyy-MM-dd");
      const dayData = calendarData.data.calendar[dateKey];

      if (dayData && !dayData.isAvailable) {
        return true;
      }

      currentDateCheck.setDate(currentDateCheck.getDate() + 1);
    }

    return false;
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none text-slate-700">
          Select Room Type
        </label>
        <Select onValueChange={onRoomSelect} value={selectedRoomId}>
          <SelectTrigger className="border-slate-200 bg-white shadow-sm transition-colors hover:border-slate-300 focus:ring-offset-0">
            <SelectValue placeholder="Select a room type" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id.toString()}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{room.type}</span>
                  <span className="text-slate-500">
                    {formatIDR(room.price)}
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
            <div className="flex w-full flex-col justify-between gap-2 transition-all sm:flex-row sm:gap-0">
              <div
                className={`${buttonClasses(
                  dateRange.from,
                )} flex h-full cursor-pointer flex-col gap-1 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 sm:rounded-l-lg sm:rounded-r-none sm:border-r-0`}
                onClick={() => setIsOpen(true)}
                aria-label="Select check-in date"
              >
                <span className="text-xs font-semibold text-slate-700">
                  CHECK-IN (14:00)
                </span>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
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
                )} flex h-full cursor-pointer flex-col gap-1 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 sm:rounded-l-none sm:rounded-r-lg`}
                onClick={() => setIsOpen(true)}
                aria-label="Select check-out date"
              >
                <span className="text-xs font-semibold text-slate-700">
                  CHECK-OUT (12:00)
                </span>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
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
                <div className="flex items-center border-b bg-gradient-to-r from-blue-50 to-slate-50 p-3 text-xs">
                  <Info className="mr-2 h-4 w-4 text-blue-500" />
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-sm bg-emerald-500 opacity-70"></div>
                      <span className="text-slate-700">Lower price</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-sm bg-rose-500 opacity-70"></div>
                      <span className="text-slate-700">Higher price</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-1 h-3 w-3 rounded-sm border border-amber-400 bg-amber-50"></div>
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
                  caption:
                    "flex justify-center pt-3 pb-1 relative items-center",
                  caption_label: "text-sm font-medium text-slate-800",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-7 w-7 bg-transparent p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-slate-500 rounded-md w-11 font-medium text-[0.8rem] py-2",
                  row: "flex w-full mt-2",
                  cell: "h-14 w-11 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-14 w-11 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors",
                  day_selected:
                    "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white rounded-md shadow-sm",
                  day_today:
                    "bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200",
                  day_outside: "text-slate-400 opacity-50",
                  day_disabled: "text-slate-400 opacity-50",
                  day_range_middle:
                    "aria-selected:bg-slate-100 aria-selected:text-slate-900",
                  day_hidden: "invisible",
                  day_button: "h-14 w-11 p-0 font-normal",
                }}
              />
              {selectedRoomId &&
                dateRange.from &&
                dateRange.to &&
                checkUnavailableDatesInRange() && (
                  <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
                    <strong>Attention:</strong> The date range you selected
                    contains dates that are already sold out. Please select a
                    different date range to continue with your booking.
                  </div>
                )}

              <div className="flex items-center justify-end gap-2 border-t bg-gradient-to-r from-slate-50 to-blue-50 p-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    onDateChange({
                      from: undefined,
                      to: undefined,
                    });
                  }}
                  className="border-slate-300 text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading && selectedRoomId && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-pulse rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            Loading pricing data...
          </div>
        </div>
      )}
      {selectedRoomId &&
        dateRange.from &&
        dateRange.to &&
        hasUnavailableDates && (
          <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
            <strong>Attention:</strong> The date range you selected contains
            dates that are already sold out. Please select a different date
            range to continue with your booking.
          </div>
        )}
      {selectedRoom &&
        dateRange.from &&
        dateRange.to &&
        totalPrice &&
        !hasUnavailableDates && (
          <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50/50 to-slate-50/50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-slate-900">
                  {selectedRoom.type}
                </h3>
                <p className="text-sm text-slate-500">
                  {nights} {nights === 1 ? "night" : "nights"},{" "}
                  {selectedRoom.guest}{" "}
                  {selectedRoom.guest === 1 ? "guest" : "guests"}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-slate-900">
                  {formatIDR(totalPrice)}
                </div>
                <div className="text-xs text-slate-500">
                  {formatIDR(Math.round(totalPrice / nights))}/night avg.
                </div>
              </div>
            </div>
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-700 hover:text-blue-600">
                <span className="flex items-center">
                  <CreditCard className="mr-1.5 h-4 w-4 text-blue-500" />
                  View price breakdown
                </span>
                <span className="text-xs text-slate-400 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="mt-2 space-y-1 pl-6 text-sm">
                {Object.entries(nightlyPrices).map(([date, price]) => (
                  <div key={date} className="flex justify-between">
                    <span className="text-slate-600">
                      {format(new Date(date), "EEE, MMM d")}
                    </span>
                    <span className="font-medium text-slate-700">
                      {formatIDR(price)}
                    </span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-medium">
                  <span className="text-slate-800">
                    Total ({nights} {nights === 1 ? "night" : "nights"})
                  </span>
                  <span className="text-blue-700">{formatIDR(totalPrice)}</span>
                </div>
              </div>
            </details>
          </div>
        )}
    </div>
  );
}
