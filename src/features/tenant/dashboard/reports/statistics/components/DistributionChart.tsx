import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { PieChart } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { DataType, DistributionChartProps } from "@/types/report";
import { ChartSkeleton } from "./LoadingSkeleton";
import {
  getChartOptions,
  prepareChartData,
} from "@/utils/distributionChartUtils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const DistributionChart = ({
  startDate,
  endDate,
  propertyId,
}: DistributionChartProps) => {
  const [dataType, setDataType] = useState<DataType>("transactions");

  const { data: salesReport, isLoading } = useSalesReport({
    startDate,
    endDate,
    propertyId,
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const propertyMetrics = salesReport?.propertyMetrics || [];
  const chartData = prepareChartData(propertyMetrics, propertyId, dataType);

  const series = chartData.map((item) => item.value);
  const labels = chartData.map((item) => item.name);
  const options = getChartOptions(labels, dataType);

  return (
    <div className="border-stroke shadow-default relative rounded-sm border bg-white">
      <div className="p-6 pb-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-2">
                <PieChart className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Distribution {propertyId ? "By Room Type" : "By Property"}
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
          </div>

          <Tabs
            value={dataType}
            onValueChange={(value) => setDataType(value as DataType)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full min-w-[200px] grid-cols-2">
              <TabsTrigger value="transactions" className="text-sm">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="revenue" className="text-sm">
                Revenue
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="chart-container w-full">
          <div className="mx-auto flex justify-center">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={400}
              width="100%"
            />
          </div>
        </div>

        {chartData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="p-6 text-center">
              <PieChart className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              <p className="font-medium text-gray-500">
                No distribution data available for the selected period
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionChart;
