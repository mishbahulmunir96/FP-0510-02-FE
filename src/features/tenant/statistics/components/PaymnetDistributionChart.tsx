import useTransactionReport from "@/hooks/api/statistic/useGetTransactionsReport";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PaymentMethodDistribution {
  MANUAL: {
    percentage: number;
    count: number;
  };
  OTOMATIS: {
    percentage: number;
    count: number;
  };
}

interface TransactionReportData {
  paymentMethodDistribution: PaymentMethodDistribution;
}

interface PaymentDistributionChartProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

export const PaymentDistributionChart = ({
  startDate,
  endDate,
  propertyId,
}: PaymentDistributionChartProps) => {
  const { data, isLoading } = useTransactionReport({
    startDate,
    endDate,
    propertyId,
  });
  const manualPercentage =
    data?.paymentMethodDistribution?.MANUAL?.percentage ?? 0;
  const otomatisPercentage =
    data?.paymentMethodDistribution?.OTOMATIS?.percentage ?? 0;

  const series = [manualPercentage, otomatisPercentage];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "sans-serif",
    },
    labels: ["Manual", "Otomatis"],
    colors: ["#3C50E0", "#80CAEE"],
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "sans-serif",
              color: "#64748B",
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "sans-serif",
              color: "#64748B",
              formatter: function (val) {
                return val + "%";
              },
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontFamily: "sans-serif",
              color: "#64748B",
              formatter: function (w) {
                return (
                  w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0,
                  ) + "%"
                );
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
    tooltip: {
      enabled: true,
      theme: "light",
      y: {
        formatter: function (value) {
          return value + "%";
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="border-stroke shadow-default col-span-4 rounded-sm border bg-white p-6">
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-stroke shadow-default relative col-span-4 rounded-sm border bg-white p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Distribusi Metode Pembayaran
        </h2>
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
            height={350}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#3C50E0]"></span>
          <span className="text-sm font-medium text-gray-700">Manual</span>
          <span className="text-sm text-gray-500">
            ({manualPercentage.toFixed(1)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#80CAEE]"></span>
          <span className="text-sm font-medium text-gray-700">Otomatis</span>
          <span className="text-sm text-gray-500">
            ({otomatisPercentage.toFixed(1)}%)
          </span>
        </div>
      </div>

      {data && series.every((value) => value === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
        </div>
      )}
    </div>
  );
};

export default PaymentDistributionChart;
