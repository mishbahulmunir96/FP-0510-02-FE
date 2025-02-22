"use client";
import { ReactNode } from "react";
import { getDateRangeParams } from "@/utils/date.utils";
import { MetricsChart } from "./components/MetricsChart";
import { RevenueChart } from "./components/ReveneuCharts";
import PaymentDistributionChart from "./components/PaymnetDistributionChart";
import StatisticFilters from "./components/StatisticFilters";
import TopPropertiesTable from "./components/TopPropertiesTable";
import { useState } from "react";
import StatCards from "./components/StatCharts";

interface FilterState {
  filterType: "date-range" | "month-year" | "year-only";
  startDate: Date;
  endDate: Date;
  month: number;
  year: number;
  propertyId: number | null;
}

const StatisticPage = () => {
  const [filters, setFilters] = useState<FilterState>(() => {
    const currentDate = new Date();
    const defaultDateRange = getDateRangeParams("date-range", {
      startDate: new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate(),
      ),
      endDate: currentDate,
    });

    return {
      filterType: "date-range",
      startDate: defaultDateRange.startDate!,
      endDate: defaultDateRange.endDate!,
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      propertyId: null,
    };
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <div className="space-y-6">
      <StatisticFilters
        filterType={filters.filterType}
        startDate={filters.startDate}
        endDate={filters.endDate}
        selectedMonth={filters.month}
        selectedYear={filters.year}
        selectedProperty={filters.propertyId}
        onFilterChange={handleFilterChange}
      />

      <StatCards
        startDate={filters.startDate}
        endDate={filters.endDate}
        propertyId={filters.propertyId}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-12">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Revenue & Transaction Trends
            </h2>
            <RevenueChart
              startDate={filters.startDate}
              endDate={filters.endDate}
              propertyId={filters.propertyId}
            />
          </div>
        </div>

        <div className="md:col-span-12">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Distribution
            </h2>
            <PaymentDistributionChart
              startDate={filters.startDate}
              endDate={filters.endDate}
              propertyId={filters.propertyId}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Top Properties</h2>
        <TopPropertiesTable
          startDate={filters.startDate}
          endDate={filters.endDate}
          propertyId={filters.propertyId}
        />
      </div>
    </div>
  );
};

export default StatisticPage;
