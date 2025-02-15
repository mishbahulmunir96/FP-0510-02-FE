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
import { cn } from "@/lib/utils";
import { Filters } from "@/types/transaction";
import { format } from "date-fns";
import {
  ArrowUpDown,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
} from "lucide-react";
import { useCallback, useState } from "react";

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
          updatedFilters.endDate = undefined;
        }
        updatedFilters.startDate = date;
      } else {
        if (date && filters.startDate && date < filters.startDate) {
          return;
        }
        updatedFilters.endDate = date;
      }

      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange],
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Select
        value={filters.sortBy}
        onValueChange={(value) => handleFiltersChange({ sortBy: value })}
      >
        <SelectTrigger className="h-11 w-full rounded-lg border-gray-200 bg-white transition-all hover:border-blue-400 hover:ring-1 hover:ring-blue-100">
          <div className="flex items-center gap-2">
            {filters.sortBy === "createdAt" && (
              <Clock className="h-4 w-4 text-gray-500" />
            )}
            {filters.sortBy === "totalPrice" && (
              <CreditCard className="h-4 w-4 text-gray-500" />
            )}
            {filters.sortBy === "duration" && (
              <CalendarIcon className="h-4 w-4 text-gray-500" />
            )}
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-lg border-gray-200">
          <SelectItem value="createdAt" className="flex items-center gap-2">
            Date
          </SelectItem>
          <SelectItem value="totalPrice" className="flex items-center gap-2">
            Price
          </SelectItem>
          <SelectItem value="duration" className="flex items-center gap-2">
            Duration
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortOrder}
        onValueChange={(value: "asc" | "desc") =>
          handleFiltersChange({ sortOrder: value })
        }
      >
        <SelectTrigger className="h-11 w-full rounded-lg border-gray-200 bg-white transition-all hover:border-blue-400 hover:ring-1 hover:ring-blue-100">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <SelectValue placeholder="Sort order" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-lg border-gray-200">
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-11 w-full justify-start rounded-lg border-gray-200 bg-white font-normal transition-all hover:border-blue-400 hover:ring-1 hover:ring-blue-100",
                !filters.startDate && "text-gray-500",
              )}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                {filters.startDate ? (
                  format(filters.startDate, "PPP")
                ) : (
                  <span>Start date</span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.startDate}
              onSelect={(date) => handleDateChange("startDate", date)}
              initialFocus
              className="rounded-lg border shadow-lg"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-11 w-full justify-start rounded-lg border-gray-200 bg-white font-normal transition-all hover:border-blue-400 hover:ring-1 hover:ring-blue-100",
                !filters.endDate && "text-gray-500",
              )}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                {filters.endDate ? (
                  format(filters.endDate, "PPP")
                ) : (
                  <span>End date</span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate}
              onSelect={(date) => handleDateChange("endDate", date)}
              initialFocus
              disabled={(date) =>
                filters.startDate ? date < filters.startDate : false
              }
              className="rounded-lg border shadow-lg"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TransactionFilters;
