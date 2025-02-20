import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePropertyReport from "@/hooks/api/statistic/useGetPropertyReport";
import DateRangePicker from "./DateRangePicker";

interface StatisticFiltersProps {
  filterType: "date-range" | "month-year" | "year-only";
  startDate: Date;
  endDate: Date;
  selectedMonth: number;
  selectedYear: number;
  selectedProperty: number | null;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onPropertyChange: (propertyId: number | null) => void;
  onFilterTypeChange: (type: "date-range" | "month-year" | "year-only") => void;
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const StatisticFilters: React.FC<StatisticFiltersProps> = ({
  filterType,
  startDate,
  endDate,
  selectedMonth,
  selectedYear,
  selectedProperty,
  onStartDateChange,
  onEndDateChange,
  onMonthChange,
  onYearChange,
  onPropertyChange,
  onFilterTypeChange,
}) => {
  const { data: properties } = usePropertyReport({
    startDate,
    endDate,
  });

  const renderFilter = () => {
    switch (filterType) {
      case "date-range":
        return (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            className="mt-4"
          />
        );
      case "month-year":
        return (
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Label className="w-20 text-gray-700">Month</Label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => onMonthChange(Number(value))}
              >
                <SelectTrigger className="w-full bg-white sm:w-[160px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="w-20 text-gray-700">Year</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => onYearChange(Number(value))}
              >
                <SelectTrigger className="w-full bg-white sm:w-[120px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "year-only":
        return (
          <div className="mt-4 flex items-center gap-2">
            <Label className="w-20 text-gray-700">Year</Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => onYearChange(Number(value))}
            >
              <SelectTrigger className="w-full bg-white sm:w-[120px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filterType}
          onValueChange={(value) =>
            onFilterTypeChange(
              value as "date-range" | "month-year" | "year-only",
            )
          }
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-[500px]">
            <TabsTrigger value="date-range">Date Range</TabsTrigger>
            <TabsTrigger value="month-year">Month & Year</TabsTrigger>
            <TabsTrigger value="year-only">Year Only</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={selectedProperty?.toString() ?? "all"}
          onValueChange={(value) =>
            onPropertyChange(value === "all" ? null : Number(value))
          }
        >
          <SelectTrigger className="w-full bg-white sm:w-[200px]">
            <SelectValue>
              {selectedProperty
                ? properties?.find((p) => p.propertyId === selectedProperty)
                    ?.propertyName
                : "All Properties"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Properties</SelectItem>
              {properties?.map((property) => (
                <SelectItem
                  key={property.propertyId}
                  value={property.propertyId.toString()}
                >
                  {property.propertyName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {renderFilter()}
    </div>
  );
};

export default StatisticFilters;
