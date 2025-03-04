import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { getDateRangeParams } from "@/utils/date.utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property, StatisticFiltersProps } from "@/types/report";
import { FiltersSkeleton } from "./LoadingSkeleton";
import DateRangePicker from "./DateRangePicker";
import { MonthYearFilter, YearFilter } from "./FilterComponents";

export const StatisticFilters: React.FC<StatisticFiltersProps> = ({
  filterType,
  startDate,
  endDate,
  selectedMonth,
  selectedYear,
  selectedProperty,
  onFilterChange,
}) => {
  const { data: salesReport, isLoading } = useSalesReport({
    startDate,
    endDate,
  });

  if (isLoading) {
    return <FiltersSkeleton />;
  }

  const properties = salesReport?.propertyMetrics || [];

  const handleFilterTypeChange = (
    type: "date-range" | "month-year" | "year-only",
  ) => {
    onFilterChange({
      filterType: type,
      propertyId: selectedProperty,
    });

    const dateRange = getDateRangeParams(type, {
      month: selectedMonth,
      year: selectedYear,
    });

    if (dateRange.startDate && dateRange.endDate) {
      onFilterChange({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        month: selectedMonth,
        year: selectedYear,
      });
    }
  };

  const handleDateChange = (type: "start" | "end", date: Date | undefined) => {
    if (!date) return;

    const newStartDate = type === "start" ? date : startDate;
    const newEndDate = type === "end" ? date : endDate;

    onFilterChange({
      filterType,
      startDate: newStartDate,
      endDate: newEndDate,
      month: selectedMonth,
      year: selectedYear,
      propertyId: selectedProperty,
    });
  };

  const handleMonthChange = (month: number) => {
    const dateRange = getDateRangeParams("month-year", {
      month,
      year: selectedYear,
    });

    if (dateRange.startDate && dateRange.endDate) {
      onFilterChange({
        filterType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        month,
        year: selectedYear,
        propertyId: selectedProperty,
      });
    }
  };

  const handleYearChange = (year: number) => {
    const dateRange = getDateRangeParams(filterType, {
      month: selectedMonth,
      year,
    });

    if (dateRange.startDate && dateRange.endDate) {
      onFilterChange({
        filterType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        month: selectedMonth,
        year,
        propertyId: selectedProperty,
      });
    }
  };

  const renderFilter = () => {
    switch (filterType) {
      case "date-range":
        return (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(date) => handleDateChange("start", date)}
            onEndDateChange={(date) => handleDateChange("end", date)}
            className="mt-4"
          />
        );
      case "month-year":
        return (
          <MonthYearFilter
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />
        );
      case "year-only":
        return (
          <YearFilter
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
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
            handleFilterTypeChange(
              value as "date-range" | "month-year" | "year-only",
            )
          }
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-[500px]">
            <TabsTrigger value="date-range">Date Range</TabsTrigger>
            <TabsTrigger value="month-year">Month</TabsTrigger>
            <TabsTrigger value="year-only">Year</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={selectedProperty?.toString() ?? "all"}
          onValueChange={(value) =>
            onFilterChange({
              filterType,
              startDate,
              endDate,
              month: selectedMonth,
              year: selectedYear,
              propertyId: value === "all" ? null : Number(value),
            })
          }
        >
          <SelectTrigger className="w-full bg-white sm:w-[200px]">
            <SelectValue>
              {selectedProperty
                ? properties?.find(
                    (p: Property) => p.propertyId === selectedProperty,
                  )?.propertyName
                : "All Properties"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Properties</SelectItem>
              {properties?.map((property: Property) => (
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
