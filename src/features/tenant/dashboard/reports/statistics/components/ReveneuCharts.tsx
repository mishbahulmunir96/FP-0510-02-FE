import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { ChartSkeleton } from "./LoadingSkeleton";
import { TrendingUp, DollarSign } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface RevenueChartProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

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

  // Use data from salesReport.transactionMetrics
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

  const options: ApexOptions = {
    colors: ["#6366F1", "#38BDF8"],
    chart: {
      fontFamily: "Inter, sans-serif",
      height: 450, // Increased height
      type: "line",
      toolbar: {
        show: true, // Enable toolbar for zoom/pan options
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      stacked: false,
      parentHeightOffset: 0,
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    plotOptions: {
      area: {
        fillTo: "origin",
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      borderColor: "#F2F2F2",
      strokeDashArray: 5,
      padding: {
        left: 20,
        right: 20,
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 5,
      colors: ["#fff"],
      strokeColors: ["#6366F1", "#38BDF8"],
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories:
        peakBookingPeriods.map((period) => {
          const diffInDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (diffInDays <= 7) {
            return format(new Date(period.date), "dd MMM");
          } else if (diffInDays <= 31) {
            const [, weekNumber] = period.date.split("-W");
            return `Week ${weekNumber}`;
          } else {
            return format(new Date(period.date + "-01"), "MMM yyyy");
          }
        }) || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
          fontWeight: 400,
        },
        rotateAlways: false,
        minHeight: 40,
      },
    },
    yaxis: [
      {
        title: {
          text: "Revenue",
          style: {
            fontSize: "13px",
            fontWeight: 500,
            color: "#6366F1",
          },
        },
        labels: {
          style: {
            colors: "#6366F1",
            fontSize: "12px",
          },
          formatter: (value) => {
            if (value >= 1000000) {
              return `Rp ${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `Rp ${(value / 1000).toFixed(0)}k`;
            }
            return `Rp ${value}`;
          },
          offsetX: -5,
        },
      },
      {
        opposite: true,
        title: {
          text: "Transactions",
          style: {
            fontSize: "13px",
            fontWeight: 500,
            color: "#38BDF8",
          },
        },
        labels: {
          style: {
            colors: "#38BDF8",
            fontSize: "12px",
          },
          offsetX: 5,
        },
      },
    ],
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        {
          formatter: (value) => formatCurrency(value),
        },
        {
          formatter: (value) => value.toFixed(0) + " transactions",
        },
      ],
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      offsetY: 8,
      markers: {
        size: 8,
        offsetX: 0,
        offsetY: 0,
        shape: "circle",
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 400,
          },
        },
      },
    ],
  };

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
        {/* Chart container with proper sizing */}
        <div className="chart-container w-full overflow-hidden">
          <div className="chart-scroll-container">
            {/* Set min-width to ensure the chart doesn't get too compressed */}
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
