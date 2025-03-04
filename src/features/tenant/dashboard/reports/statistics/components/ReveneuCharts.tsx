import dynamic from "next/dynamic";
import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { TrendingUp, DollarSign } from "lucide-react";
import { RevenueChartProps } from "@/types/report";
import { ChartSkeleton } from "./LoadingSkeleton";
import { getChartOptions } from "@/utils/revenueChartUtils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const RevenueChart = ({
  startDate,
  endDate,
  propertyId,
}: RevenueChartProps) => {
  const { data: salesReport, isLoading } = useSalesReport({
    startDate,
    endDate,
    propertyId,
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const peakBookingPeriods =
    salesReport?.transactionMetrics.peakBookingPeriods || [];

  const series = [
    {
      name: "Revenue",
      type: "area",
      data: peakBookingPeriods.map((period) => period.totalRevenue) || [],
    },
    {
      name: "Transactions",
      type: "area",
      data: peakBookingPeriods.map((period) => period.totalBookings) || [],
    },
  ];

  const options = getChartOptions(peakBookingPeriods, startDate, endDate);

  return (
    <div className="border-stroke rounded-sm border bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 p-6 pb-0">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-full bg-indigo-50 p-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Revenue & Transaction Trends
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="relative px-4 pt-4">
        <div className="chart-container w-full overflow-hidden">
          <div className="chart-scroll-container">
            <div
              style={{
                minWidth: peakBookingPeriods.length > 10 ? "800px" : "100%",
              }}
            >
              <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={450}
                width="100%"
              />
            </div>
          </div>
        </div>

        {peakBookingPeriods.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-center">
              <DollarSign className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              <p className="font-medium text-gray-500">
                No revenue data available for the selected period
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
