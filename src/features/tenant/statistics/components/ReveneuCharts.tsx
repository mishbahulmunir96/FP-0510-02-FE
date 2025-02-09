// features/tenant/statistics/components/charts/RevenueChart.tsx
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { formatRupiah } from "@/lib/utils";
import useTransactionReport from "@/hooks/api/statistic/useGetTransactionsReport";

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
  const { data } = useTransactionReport({
    startDate,
    endDate,
    propertyId,
  });
  const series = [
    {
      name: "Pendapatan",
      data:
        data?.peakBookingPeriods.map((period) => period.totalBookings) || [],
    },
  ];

  const options: ApexOptions = {
    colors: ["#4318FF", "#80CAEE"],
    chart: {
      fontFamily: "sans-serif",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
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
      size: 4,
      colors: "#fff",
      strokeColors: ["#4318FF", "#80CAEE"],
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: data?.peakBookingPeriods.map((period) => period.date) || [],
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
    yaxis: {
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
          fontWeight: 400,
        },
        formatter: (value) => formatRupiah(value),
      },
    },
    fill: {
      opacity: 0.1,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => formatRupiah(value),
      },
    },
  };

  return (
    <div className="border-stroke shadow-default col-span-8 rounded-sm border bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex gap-5">
          <div className="flex items-center">
            <span className="mr-2 h-3 w-3 rounded-full bg-blue-600"></span>
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Total Pendapatan
              </p>
              <p className="text-xs text-gray-500">
                {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex rounded-lg bg-gray-50 p-1">
          <button className="rounded-lg bg-white px-3 py-1 text-sm font-medium shadow-sm">
            Hari
          </button>
          <button className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm">
            Minggu
          </button>
          <button className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm">
            Bulan
          </button>
        </div>
      </div>

      <div>
        <div id="revenueChart" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};
