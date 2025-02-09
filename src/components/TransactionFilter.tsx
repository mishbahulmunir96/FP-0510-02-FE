"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Filters } from "@/types/transaction";

interface TransactionFiltersProps {
  initialFilters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const TransactionFilters = ({
  initialFilters,
  onFilterChange,
}: TransactionFiltersProps) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<Filters>) => {
      const updatedFilters = {
        ...filters,
        ...newFilters,
      };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange],
  );

  const handleDateChange = useCallback(
    (type: "startDate" | "endDate", date: Date | undefined) => {
      const updatedFilters = { ...filters };

      if (type === "startDate") {
        if (date && filters.endDate && date > filters.endDate) {
          // Jika startDate lebih besar dari endDate, reset endDate
          updatedFilters.endDate = undefined;
        }
        updatedFilters.startDate = date;
      } else {
        if (date && filters.startDate && date < filters.startDate) {
          return; // Tidak mengizinkan endDate lebih kecil dari startDate
        }
        updatedFilters.endDate = date;
      }

      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange],
  );

  return (
    <div className="flex flex-wrap gap-4">
      <div className="min-w-[200px] flex-1">
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleFiltersChange({ sortBy: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date</SelectItem>
            <SelectItem value="totalPrice">Price</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[200px] flex-1">
        <Select
          value={filters.sortOrder}
          onValueChange={(value: "asc" | "desc") =>
            handleFiltersChange({ sortOrder: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-[300px] flex-[2] gap-4">
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? (
                  format(filters.startDate, "PPP")
                ) : (
                  <span>Start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => handleDateChange("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? (
                  format(filters.endDate, "PPP")
                ) : (
                  <span>End date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => handleDateChange("endDate", date)}
                initialFocus
                disabled={(date) =>
                  filters.startDate ? date < filters.startDate : false
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
