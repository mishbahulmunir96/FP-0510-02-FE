// features/tenant/statistics/index.tsx
"use client";

import { subYears } from "date-fns";
import { useQueryStates } from "nuqs";
import { statisticQueryStates } from "@/lib/query-params";
import { StatCards } from "./components/StatCharts";
import { MetricsChart } from "./components/MetricsChart";
import { RevenueChart } from "./components/ReveneuCharts";
import PaymentDistributionChart from "./components/PaymnetDistributionChart";
import { TopPropertiesTable } from "./components/TopPRopertiesTable";
import StatisticFilters from "./components/StatisticFilters";

const StatisticPage = () => {
  const [queryStates, setQueryStates] = useQueryStates(statisticQueryStates);
  const { filterType, startDate, endDate, month, year, propertyId } =
    queryStates;

  // Handle filter type change
  const handleFilterTypeChange = (
    type: "date-range" | "month-year" | "year-only",
  ) => {
    if (type === "month-year") {
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0);

      setQueryStates({
        ...queryStates,
        filterType: type,
        startDate: firstDayOfMonth.toISOString(),
        endDate: lastDayOfMonth.toISOString(),
      });
    } else if (type === "year-only") {
      const firstDayOfYear = new Date(year, 0, 1);
      const lastDayOfYear = new Date(year, 11, 31);

      setQueryStates({
        ...queryStates,
        filterType: type,
        startDate: firstDayOfYear.toISOString(),
        endDate: lastDayOfYear.toISOString(),
      });
    } else {
      setQueryStates({
        ...queryStates,
        filterType: type,
      });
    }
  };

  const handleDateChange = (start?: Date, end?: Date) => {
    setQueryStates({
      ...queryStates,
      startDate: start?.toISOString() ?? "",
      endDate: end?.toISOString() ?? "",
    });
  };

  const handleMonthChange = (newMonth: number) => {
    const firstDayOfMonth = new Date(year, newMonth - 1, 1);
    const lastDayOfMonth = new Date(year, newMonth, 0);

    setQueryStates({
      ...queryStates,
      month: newMonth,
      startDate: firstDayOfMonth.toISOString(),
      endDate: lastDayOfMonth.toISOString(),
    });
  };

  const handleYearChange = (newYear: number) => {
    if (filterType === "year-only") {
      const firstDayOfYear = new Date(newYear, 0, 1);
      const lastDayOfYear = new Date(newYear, 11, 31);

      setQueryStates({
        ...queryStates,
        year: newYear,
        startDate: firstDayOfYear.toISOString(),
        endDate: lastDayOfYear.toISOString(),
      });
    } else {
      const firstDayOfMonth = new Date(newYear, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0);

      setQueryStates({
        ...queryStates,
        year: newYear,
        startDate: firstDayOfMonth.toISOString(),
        endDate: lastDayOfMonth.toISOString(),
      });
    }
  };

  const handlePropertyChange = (newPropertyId: number | null) => {
    setQueryStates({
      ...queryStates,
      propertyId: newPropertyId,
    });
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <StatisticFilters
          filterType={filterType}
          startDate={startDate ? new Date(startDate) : subYears(new Date(), 1)}
          endDate={endDate ? new Date(endDate) : new Date()}
          selectedMonth={month}
          selectedYear={year}
          selectedProperty={Number(propertyId)}
          onStartDateChange={(date) =>
            handleDateChange(date, new Date(endDate))
          }
          onEndDateChange={(date) =>
            handleDateChange(new Date(startDate), date)
          }
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onPropertyChange={handlePropertyChange}
          onFilterTypeChange={handleFilterTypeChange}
        />
      </div>

      <StatCards
        startDate={new Date(startDate || subYears(new Date(), 1).toISOString())}
        endDate={new Date(endDate || new Date().toISOString())}
        propertyId={Number(propertyId)}
      />

      <div className="2xl:mt-7.5 2xl:gap-7.5 mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6">
        <RevenueChart
          startDate={
            new Date(startDate || subYears(new Date(), 1).toISOString())
          }
          endDate={new Date(endDate || new Date().toISOString())}
          propertyId={Number(propertyId)}
        />
        <PaymentDistributionChart
          startDate={
            new Date(startDate || subYears(new Date(), 1).toISOString())
          }
          endDate={new Date(endDate || new Date().toISOString())}
          propertyId={Number(propertyId)}
        />
        {/* <MetricsChart
          startDate={
            new Date(startDate || subYears(new Date(), 1).toISOString())
          }
          endDate={new Date(endDate || new Date().toISOString())}
          propertyId={Number(propertyId)}
        /> */}
        <TopPropertiesTable
          startDate={
            new Date(startDate || subYears(new Date(), 1).toISOString())
          }
          endDate={new Date(endDate || new Date().toISOString())}
          propertyId={Number(propertyId)}
        />
      </div>
    </div>
  );
};

export default StatisticPage;
