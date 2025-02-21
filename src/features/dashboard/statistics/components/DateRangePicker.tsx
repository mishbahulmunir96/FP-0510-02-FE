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

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Label htmlFor="startDate" className="w-24 text-gray-700">
          Start Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="startDate"
              variant={"outline"}
              className={cn(
                "w-full justify-start bg-white text-left font-normal sm:w-[240px]",
                !startDate && "text-gray-500",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
              disabled={(date) => date > endDate || date > new Date()}
              className="rounded-md border shadow-lg"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="endDate" className="w-24 text-gray-700">
          End Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="endDate"
              variant={"outline"}
              className={cn(
                "w-full justify-start bg-white text-left font-normal sm:w-[240px]",
                !endDate && "text-gray-500",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              initialFocus
              disabled={(date) => date < startDate || date > new Date()}
              className="rounded-md border shadow-lg"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangePicker;
