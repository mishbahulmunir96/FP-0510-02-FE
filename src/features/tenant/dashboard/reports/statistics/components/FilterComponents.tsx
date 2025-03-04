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

interface YearFilterProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
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
export const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const YearFilter: React.FC<YearFilterProps> = ({
  selectedYear,
  onYearChange,
}) => {
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
};

interface MonthYearFilterProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export const MonthYearFilter: React.FC<MonthYearFilterProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
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
                <SelectItem key={month.value} value={month.value.toString()}>
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
};
