import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { formatRupiah } from "@/lib/utils";
import useTransactionReport from "@/hooks/api/statistic/useGetTransactionsReport";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MetricsChartProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

export const MetricsChart = ({
  startDate,
  endDate,
  propertyId,
}: MetricsChartProps) => {
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
      zoom: {
        enabled: false,
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
      colors: ["#fff"],
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
      theme: "light",
      y: {
        formatter: (value) => formatRupiah(value),
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontFamily: "sans-serif",
      fontSize: "14px",
      offsetY: -10,
      markers: {
        size: 8,
        offsetX: 0,
        offsetY: 0,
        shape: "circle",
      },
      itemMargin: {
        horizontal: 15,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 250,
          },
          legend: {
            position: "bottom",
            offsetY: 0,
          },
        },
      },
    ],
  };

  return (
    <div className="border-stroke shadow-default col-span-12 rounded-sm border bg-white p-6 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Tren Pendapatan</h2>
          <p className="mt-1 text-sm text-gray-600">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#4318FF]"></div>
            <span className="text-sm text-gray-600">Pendapatan</span>
          </div>
        </div>
      </div>

      <div className="relative mt-4 min-h-[400px]">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
          width="100%"
        />

        {data && data.peakBookingPeriods.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsChart;
