import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { formatRupiah } from "@/lib/utils";
import useTransactionReport from "@/hooks/api/statistic/useGetTransactionsReport";
import { format } from "date-fns";

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
      type: "area",
      data: data?.peakBookingPeriods.map((period) => period.totalRevenue) || [],
    },
    {
      name: "Transaksi",
      type: "area",
      data:
        data?.peakBookingPeriods.map((period) => period.totalBookings) || [],
    },
  ];

  const options: ApexOptions = {
    colors: ["#4318FF", "#80CAEE"],
    chart: {
      fontFamily: "sans-serif",
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
      stacked: false,
      parentHeightOffset: 0,
    },
    plotOptions: {
      area: {
        fillTo: "origin",
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
      categories:
        data?.peakBookingPeriods.map((period) => {
          const diffInDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (diffInDays <= 7) {
            return format(new Date(period.date), "dd MMM");
          } else if (diffInDays <= 31) {
            const [, weekNumber] = period.date.split("-W");
            return `Minggu ${weekNumber}`;
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
          text: "Pendapatan",
          style: {
            fontSize: "12px",
            fontWeight: 400,
            color: "#4318FF",
          },
        },
        labels: {
          style: {
            colors: "#4318FF",
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
          text: "Jumlah Transaksi",
          style: {
            fontSize: "12px",
            fontWeight: 400,
            color: "#80CAEE",
          },
        },
        labels: {
          style: {
            colors: "#80CAEE",
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
          formatter: (value) => formatRupiah(value),
        },
        {
          formatter: (value) => value.toFixed(0) + " transaksi",
        },
      ],
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontFamily: "sans-serif",
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
    <div className="border-stroke shadow-default col-span-8 rounded-sm border bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Tren Pendapatan & Transaksi
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

        {data && data.peakBookingPeriods.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
