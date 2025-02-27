"use client";
import { FilterType } from "@/types/report";
import { getDateRangeParams } from "@/utils/date.utils";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import DistributionChart from "./components/DistributionChart";
import { RevenueChart } from "./components/ReveneuCharts";
import StatCards from "./components/StatCharts";
import StatisticFilters from "./components/StatisticFilters";
import TopPropertiesTable from "./components/TopPropertiesTable";

const StatisticPage = () => {
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 29);

  const [filterType, setFilterType] = useQueryState(
    "filterType",
    parseAsStringEnum<FilterType>([
      "date-range",
      "month-year",
      "year-only",
    ]).withDefault("date-range"),
  );

  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsString.withDefault(defaultStartDate.toISOString()),
  );

  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsString.withDefault(new Date().toISOString()),
  );

  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault(String(new Date().getMonth() + 1)),
  );

  const [year, setYear] = useQueryState(
    "year",
    parseAsString.withDefault(String(new Date().getFullYear())),
  );

  const [propertyId, setPropertyId] = useQueryState(
    "propertyId",
    parseAsString.withDefault(""),
  );

  const handleFilterChange = async (newFilters: {
    filterType?: FilterType;
    startDate?: Date;
    endDate?: Date;
    month?: number;
    year?: number;
    propertyId?: number | null;
  }) => {
    if (newFilters.filterType) {
      await setFilterType(newFilters.filterType);
    }

    if (newFilters.filterType === "date-range") {
      if (newFilters.startDate) {
        await setStartDate(newFilters.startDate.toISOString());
      }
      if (newFilters.endDate) {
        await setEndDate(newFilters.endDate.toISOString());
      }
    } else if (newFilters.filterType === "month-year") {
      if (newFilters.month) {
        await setMonth(String(newFilters.month));
      }
      if (newFilters.year) {
        await setYear(String(newFilters.year));
      }
      const dateRange = getDateRangeParams("month-year", {
        month: newFilters.month || Number(month),
        year: newFilters.year || Number(year),
      });
      if (dateRange.startDate && dateRange.endDate) {
        await setStartDate(dateRange.startDate.toISOString());
        await setEndDate(dateRange.endDate.toISOString());
      }
    } else if (newFilters.filterType === "year-only") {
      if (newFilters.year) {
        await setYear(String(newFilters.year));
      }
      const dateRange = getDateRangeParams("year-only", {
        year: newFilters.year || Number(year),
      });
      if (dateRange.startDate && dateRange.endDate) {
        await setStartDate(dateRange.startDate.toISOString());
        await setEndDate(dateRange.endDate.toISOString());
      }
    }

    if ("propertyId" in newFilters) {
      await setPropertyId(newFilters.propertyId?.toString() ?? "");
    }
  };

  return (
    <div className="space-y-6">
      <StatisticFilters
        filterType={filterType as FilterType}
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        selectedMonth={Number(month)}
        selectedYear={Number(year)}
        selectedProperty={propertyId ? Number(propertyId) : null}
        onFilterChange={handleFilterChange}
      />

      <StatCards
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        propertyId={propertyId ? Number(propertyId) : null}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-12">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Revenue & Transaction Trends
            </h2>
            <RevenueChart
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
              propertyId={propertyId ? Number(propertyId) : null}
            />
          </div>
        </div>

        <div className="md:col-span-12">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Distribution
            </h2>
            <DistributionChart
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
              propertyId={propertyId ? Number(propertyId) : null}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Top Properties</h2>
        <TopPropertiesTable
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          propertyId={propertyId ? Number(propertyId) : null}
        />
      </div>
    </div>
  );
};

export default StatisticPage;
