import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { formatCurrency } from "@/lib/utils";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ChartSkeleton } from "./LoadingSkeleton";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface DistributionChartProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

type DataType = "transactions" | "revenue";

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

  const propertyMetrics = salesReport?.propertyMetrics || [];

  const chartData = propertyId
    ? propertyMetrics
        .find((p) => p.propertyId === propertyId)
        ?.roomDetails.map((room) => ({
          name: room.roomType,
          value:
            dataType === "transactions"
              ? room.totalBookings
              : room.totalRevenue,
        })) || []
    : propertyMetrics.map((property) => ({
        name: property.propertyName,
        value:
          dataType === "transactions"
            ? property.totalTransactions
            : property.totalRevenue,
      })) || [];

  const series = chartData.map((item) => item.value);
  const labels = chartData.map((item) => item.name);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif",
    },
    labels,
    colors: ["#3B82F6", "#6366F1", "#EC4899", "#F59E0B", "#10B981"],
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
      markers: {
        size: 12,
        strokeWidth: 0,
        offsetX: 0,
        offsetY: 0,
        shape: "circle",
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8,
      },
      offsetY: 20,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
              formatter: function (val) {
                return dataType === "transactions"
                  ? val + " transactions"
                  : formatCurrency(Number(val));
              },
            },
            total: {
              show: true,
              label:
                dataType === "transactions"
                  ? "Total Transactions"
                  : "Total Revenue",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => {
                    return a + b;
                  },
                  0,
                );
                return dataType === "transactions"
                  ? total.toString()
                  : formatCurrency(total);
              },
            },
          },
        },
      },
    },
    dataLabels: {
      formatter: function (val, opts) {
        const value = Number(val);
        return value.toFixed(1) + "%";
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return dataType === "transactions"
            ? `${value} transactions`
            : formatCurrency(Number(value));
        },
      },
    },
  };

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <div className="border-stroke shadow-default relative rounded-sm border bg-white p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Distribution {propertyId ? "By Room Type" : "By Property"}
          </h2>
          <Tabs
            value={dataType}
            onValueChange={(value) => setDataType(value as DataType)}
          >
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </p>
      </div>

      <div className="mb-2">
        <div className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={400}
          />
        </div>
      </div>

      {chartData.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <p className="text-gray-500">No data to display</p>
        </div>
      )}
    </div>
  );
};

export default DistributionChart;
