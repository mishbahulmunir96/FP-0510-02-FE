import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { PieChart } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { DataType, DistributionChartProps } from "@/types/report";
import { ChartSkeleton } from "./LoadingSkeleton";
<<<<<<< HEAD
import { PieChart, DollarSign } from "lucide-react";
=======
import {
  getChartOptions,
  prepareChartData,
} from "@/utils/distributionChartUtils";
>>>>>>> 5d8a0be1228781fedb1fa034b7e16873b050b305

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

<<<<<<< HEAD
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

  // Enhanced color palette with better contrast
  const colors = [
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#F97316",
    "#10B981",
    "#06B6D4",
    "#0EA5E9",
    "#6366F1",
    "#8B5CF6",
  ];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif",
      height: 400,
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    labels,
    colors,
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      markers: {
        size: 10,
        strokeWidth: 0,
        offsetX: 0,
        offsetY: 0,
        shape: "circle",
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8,
      },
      offsetY: 10,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              color: undefined,
              offsetY: 5,
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
              fontSize: "16px",
              fontWeight: 600,
              color: "#6B7280",
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
      enabled: true,
      formatter: function (val, opts) {
        const value = Number(val);
        return value.toFixed(1) + "%";
      },
      style: {
        fontSize: "12px",
        fontWeight: 500,
        fontFamily: "Inter, sans-serif",
      },
      dropShadow: {
        enabled: false,
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
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    stroke: {
      width: 2,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
            offsetY: 0,
            height: 120,
          },
        },
      },
    ],
  };

=======
>>>>>>> 5d8a0be1228781fedb1fa034b7e16873b050b305
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
