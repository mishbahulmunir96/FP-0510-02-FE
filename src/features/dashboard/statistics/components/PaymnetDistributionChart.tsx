import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePropertyReport from "@/hooks/api/statistic/useGetPropertyReport";
import { formatCurrency } from "@/lib/utils";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PaymentDistributionChartProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

type DataType = "transactions" | "revenue";

export const PaymentDistributionChart = ({
  startDate,
  endDate,
  propertyId,
}: PaymentDistributionChartProps) => {
  const [dataType, setDataType] = useState<DataType>("transactions");

  const { data: propertyData } = usePropertyReport({
    startDate,
    endDate,
    propertyId,
  });

  // Persiapkan data berdasarkan propertyId
  const chartData = propertyId
    ? // Jika propertyId ada, tampilkan data per room type
      propertyData
        ?.find((p) => p.propertyId === propertyId)
        ?.roomDetails.map((room) => ({
          name: room.roomType,
          value:
            dataType === "transactions"
              ? room.totalBookings
              : room.totalRevenue,
        })) || []
    : // Jika tidak ada propertyId, tampilkan data per property
      propertyData?.map((property) => ({
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
      fontFamily: "sans-serif",
    },
    labels,
    colors: ["#3C50E0", "#80CAEE", "#F0ABFC", "#FBBF24", "#34D399"],
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontFamily: "sans-serif",
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
            total: {
              show: true,
              label:
                dataType === "transactions"
                  ? "Total Transaksi"
                  : "Total Pendapatan",
              formatter: function (w) {
                // Fix: Pastikan penjumlahan menggunakan number
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
      formatter: function (value) {
        return dataType === "transactions"
          ? `${value} transaksi`
          : formatCurrency(Number(value));
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return dataType === "transactions"
            ? `${value} transaksi`
            : formatCurrency(Number(value));
        },
      },
    },
  };

  return (
    <div className="border-stroke shadow-default relative rounded-sm border bg-white p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Distribusi {propertyId ? "Per Tipe Kamar" : "Per Property"}
          </h2>
          <Tabs
            value={dataType}
            onValueChange={(value) => setDataType(value as DataType)}
          >
            <TabsList>
              <TabsTrigger value="transactions">Transaksi</TabsTrigger>
              <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
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
          <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
        </div>
      )}
    </div>
  );
};

export default PaymentDistributionChart;
