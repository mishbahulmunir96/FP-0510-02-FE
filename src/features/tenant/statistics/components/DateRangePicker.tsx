// components/DateRangePicker.tsx
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
import { Label } from "@/components/ui/label";

interface DateRangePickerCustomProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DateRangePickerCustomProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Label htmlFor="startDate" className="w-24">
          Tanggal Awal
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="startDate"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal sm:w-[240px]",
                !startDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "PPP")
              ) : (
                <span>Pilih tanggal</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
              disabled={(date) => date > endDate || date > new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="endDate" className="w-24">
          Tanggal Akhir
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="endDate"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal sm:w-[240px]",
                !endDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              initialFocus
              disabled={(date) => date < startDate || date > new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default DateRangePicker;
