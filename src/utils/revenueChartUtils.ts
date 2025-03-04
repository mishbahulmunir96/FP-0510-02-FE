import { formatCurrency } from "@/lib/utils";
import { PeakBookingPeriod } from "@/types/report";
import { ApexOptions } from "apexcharts";
import { format } from "date-fns";

export const getChartOptions = (
  peakBookingPeriods: PeakBookingPeriod[],
  startDate: Date,
  endDate: Date,
): ApexOptions => {
  return {
    colors: ["#6366F1", "#38BDF8"],
    chart: {
      fontFamily: "Inter, sans-serif",
      height: 450,
      type: "line",
      toolbar: {
        show: true,
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
};
