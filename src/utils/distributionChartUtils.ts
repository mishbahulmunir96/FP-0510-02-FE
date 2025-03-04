import { formatCurrency } from "@/lib/utils";
import { ChartItem, DataType } from "@/types/report";
import { ApexOptions } from "apexcharts";

export const prepareChartData = (
  propertyMetrics: any[],
  propertyId: number | null | undefined,
  dataType: DataType,
): ChartItem[] => {
  if (propertyId) {
    return (
      propertyMetrics
        .find((p) => p.propertyId === propertyId)
        ?.roomDetails.map((room: any) => ({
          name: room.roomType,
          value:
            dataType === "transactions"
              ? room.totalBookings
              : room.totalRevenue,
        })) || []
    );
  } else {
    return (
      propertyMetrics.map((property) => ({
        name: property.propertyName,
        value:
          dataType === "transactions"
            ? property.totalTransactions
            : property.totalRevenue,
      })) || []
    );
  }
};

export const getChartOptions = (
  labels: string[],
  dataType: DataType,
): ApexOptions => {
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

  return {
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
};
