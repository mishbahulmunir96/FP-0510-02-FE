"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
import {
  formatLocalDate,
  standardizeToCheckInTime,
  standardizeToCheckOutTime,
} from "@/utils/date";
import { toZonedTime } from "date-fns-tz";

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
const disabledDays = [{ before: today }];

const TIMEZONE = "Asia/Jakarta";

export function RoomPriceCalendar({
  rooms,
  onRoomSelect,
  selectedRoomId,
  onDateChange,
  dateRange,
}: RoomPriceCalendarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (newDateRange: DateRange | undefined) => {
    if (!newDateRange) {
      onDateChange({ from: undefined, to: undefined });
      return;
    }

    let { from, to } = newDateRange;

    if (from) {
      const zonedFrom = toZonedTime(from, TIMEZONE);
      from = standardizeToCheckInTime(zonedFrom);
    }
    if (to) {
      const zonedTo = toZonedTime(to, TIMEZONE);
      to = standardizeToCheckOutTime(zonedTo);
    }

    if (from && to && from > to) {
      onDateChange({ from, to: undefined });
    } else {
      onDateChange({ from, to });
    }
  };

  const buttonClasses = (date: Date | undefined) =>
    cn(
      "w-full justify-start text-left font-normal",
      !date && "text-muted-foreground",
    );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
          Select Room Type
        </label>
        <Select onValueChange={onRoomSelect} value={selectedRoomId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a room type" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id.toString()}>
                <div className="flex items-center justify-between gap-4">
                  <span>{room.type}</span>
                  <span className="text-muted-foreground">
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
            <div className="flex w-full justify-between divide-x rounded-lg border">
              <div
                className={`${buttonClasses(
                  dateRange.from,
                )} flex h-full cursor-pointer flex-col gap-1 p-2`}
                onClick={() => setIsOpen(true)}
                aria-label="Pilih tanggal check-in"
              >
                <span className="text-xs font-semibold">CHECK-IN (14:00)</span>
                <div className="flex text-xs">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from
                    ? formatLocalDate(dateRange.from)
                    : "DD/MM/YYYY"}
                </div>
              </div>

              <div
                className={`${buttonClasses(
                  dateRange.to,
                )} flex h-full cursor-pointer flex-col gap-1 p-2`}
                onClick={() => setIsOpen(true)}
                aria-label="Pilih tanggal check-out"
              >
                <span className="text-xs font-semibold">CHECK-OUT (12:00)</span>
                <div className="flex text-xs">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? formatLocalDate(dateRange.to) : "DD/MM/YYYY"}
                </div>
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col">
              <Calendar
                mode="range"
                defaultMonth={dateRange.from || new Date()}
                selected={dateRange}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                showOutsideDays={false}
                initialFocus
                disabled={disabledDays}
                classNames={{
                  months: "flex space-x-4",
                  head_row: "flex justify-between",
                  head_cell: "text-muted-foreground font-normal",
                  cell: cn(
                    "h-9 w-9 text-center text-sm p-0 relative",
                    "[&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                  ),
                  day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    "hover:bg-accent hover:text-accent-foreground",
                  ),
                  day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />

              <div className="flex items-center justify-end gap-2 border-t p-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onDateChange({
                      from: undefined,
                      to: undefined,
                    });
                  }}
                >
                  Reset
                </Button>
                <Button onClick={() => setIsOpen(false)}>Close</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
