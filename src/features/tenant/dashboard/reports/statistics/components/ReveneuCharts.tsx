import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { ChartSkeleton } from "./LoadingSkeleton";

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
      height: 350,
      type: "line",
      toolbar: {
        show: false,
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
          },
          formatter: (value) => {
            if (value >= 1000) {
              return `Rp ${(value / 1000).toFixed(0)}k`;
            }
            return `Rp ${value}`;
          },
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
          },
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
  };

  return (
    <div className="border-stroke shadow-default rounded-sm border bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Revenue & Transaction Trends
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="relative mt-4 min-h-[400px] pt-4">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
          width="100%"
        />

        {peakBookingPeriods.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <p className="text-gray-500">No data to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
