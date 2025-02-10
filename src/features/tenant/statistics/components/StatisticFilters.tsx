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
import { subYears } from "date-fns";
import DateRangePicker from "./DateRangePicker";
import { useState } from "react";

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
  const [selectValue, setSelectValue] = useState(
    selectedProperty?.toString() ?? "all",
  );

  const { data: properties } = usePropertyReport({
    startDate: startDate ? startDate : subYears(new Date(), 1),
    endDate: endDate ? endDate : new Date(),
  });

  // Dalam fungsi renderFilter, perbaiki case "year-only":
  const renderFilter = () => {
    switch (filterType) {
      case "date-range":
        return (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
          />
        );
      case "month-year":
        return (
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
        );
      case "year-only":
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
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
            <TabsTrigger value="date-range">Range Tanggal</TabsTrigger>
            <TabsTrigger value="month-year">Bulan & Tahun</TabsTrigger>
            <TabsTrigger value="year-only">Tahun</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          defaultValue="all"
          value={selectedProperty?.toString() ?? "all"}
          onValueChange={(value) =>
            onPropertyChange(value === "all" ? null : Number(value))
          }
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue defaultValue="all">
              {selectedProperty
                ? properties?.find((p) => p.propertyId === selectedProperty)
                    ?.propertyName
                : "Semua Property"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Property</SelectItem>
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
