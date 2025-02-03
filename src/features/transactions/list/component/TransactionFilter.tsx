"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./DatePickerWithRange";

interface Filters {
  sortBy: string;
  sortOrder: "asc" | "desc";
  startDate?: Date;
  endDate?: Date;
}

interface TransactionFiltersProps {
  initialFilters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const TransactionFilters = ({
  initialFilters,
  onFilterChange,
}: TransactionFiltersProps) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [date, setDate] = useState<DateRange | undefined>({
    from: initialFilters.startDate,
    to: initialFilters.endDate,
  });

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

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    handleFiltersChange({
      startDate: newDate?.from,
      endDate: newDate?.to,
    });
  };

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

      <div className="min-w-[300px] flex-[2]">
        <DatePickerWithRange date={date} onDateChange={handleDateChange} />
      </div>
    </div>
  );
};

export default TransactionFilters;
