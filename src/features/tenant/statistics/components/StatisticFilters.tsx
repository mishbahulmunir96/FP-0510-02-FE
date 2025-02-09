import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePropertyReport from "@/hooks/api/statistic/useGetPropertyReport";
import { addDays } from "date-fns";
import DateRangePicker from "./DateRangePicker";

interface StatisticFiltersProps {
  filterType: "date-range" | "month-year"; // Update this type
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
  onFilterTypeChange: (type: "date-range" | "month-year") => void; // Update this type
}

const months = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const StatisticFilters = ({
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
}: StatisticFiltersProps) => {
  // Get property list untuk dropdown
  const { data: properties } = usePropertyReport({
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
  });

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filterType}
          onValueChange={(value) =>
            onFilterTypeChange(value as "date-range" | "month-year")
          }
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
            <TabsTrigger value="date-range">Range Tanggal</TabsTrigger>
            <TabsTrigger value="month-year">Bulan & Tahun</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={selectedProperty?.toString() ?? "all"}
          onValueChange={(value) =>
            onPropertyChange(value === "all" ? null : Number(value))
          }
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Pilih Property" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Property</SelectItem>
            {properties?.map((property) => (
              <SelectItem
                key={property.propertyId}
                value={property.propertyId.toString()}
              >
                {property.propertyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filterType === "date-range" ? (
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Label className="w-16">Bulan</Label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => onMonthChange(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Pilih Bulan" />
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
            <Label className="w-16">Tahun</Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => onYearChange(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Pilih Tahun" />
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
      )}
    </div>
  );
};

export default StatisticFilters;
