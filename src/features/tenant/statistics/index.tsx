"use client";

import { ReactNode } from "react";
import { useQueryStates } from "nuqs";
import { statisticQueryStates } from "@/lib/query-params";
import { StatCards } from "./components/StatCharts";
import { MetricsChart } from "./components/MetricsChart";
import { RevenueChart } from "./components/ReveneuCharts";
import PaymentDistributionChart from "./components/PaymnetDistributionChart";
import StatisticFilters from "./components/StatisticFilters";
import { TopPropertiesTable } from "./components/TopPropertiesTable";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
}

const ChartContainer = ({ title, children }: ChartContainerProps) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
    <h2 className="mb-4 text-xl font-bold text-gray-800">{title}</h2>
    {children}
  </div>
);

interface FilterSectionProps {
  children: ReactNode;
}

const FilterSection = ({ children }: FilterSectionProps) => (
  <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {children}
    </div>
  </div>
);

const StatisticPage = () => {
  const [queryStates, setQueryStates] = useQueryStates(statisticQueryStates);
  const { filterType, startDate, endDate, month, year, propertyId } =
    queryStates;

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

  const getDefaultStartDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <FilterSection>
          <StatisticFilters
            filterType={filterType}
            startDate={startDate ? new Date(startDate) : getDefaultStartDate()}
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
        </FilterSection>

        <div className="mb-8">
          <StatCards
            startDate={
              new Date(startDate || getDefaultStartDate().toISOString())
            }
            endDate={new Date(endDate || new Date().toISOString())}
            propertyId={Number(propertyId)}
          />
        </div>

        <div className="mb-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <ChartContainer title="Revenue & Transaction Trends">
              <RevenueChart
                startDate={
                  new Date(startDate || getDefaultStartDate().toISOString())
                }
                endDate={new Date(endDate || new Date().toISOString())}
                propertyId={Number(propertyId)}
              />
            </ChartContainer>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ChartContainer title="Distribution">
              <PaymentDistributionChart
                startDate={
                  new Date(startDate || getDefaultStartDate().toISOString())
                }
                endDate={new Date(endDate || new Date().toISOString())}
                propertyId={Number(propertyId)}
              />
            </ChartContainer>
          </div>
        </div>

        <div className="col-span-12">
          <ChartContainer title="Top Properties">
            <TopPropertiesTable
              startDate={
                new Date(startDate || getDefaultStartDate().toISOString())
              }
              endDate={new Date(endDate || new Date().toISOString())}
              propertyId={Number(propertyId)}
            />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticPage;
