import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { Building2, DollarSign, Percent, ShoppingCart } from "lucide-react";
import CardDataStats from "./CardDataStats";
import { formatCurrency } from "@/lib/utils";
import { StatCardsSkeletonList } from "./LoadingSkeleton";

interface StatCardsProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

const StatCards = ({ startDate, endDate, propertyId }: StatCardsProps) => {
  // Use useSalesReport for the current period
  const { data: salesReport, isLoading: isCurrentLoading } = useSalesReport({
    startDate,
    endDate,
    propertyId,
  });

  const previousStartDate = new Date(startDate);
  const previousEndDate = new Date(endDate);
  const diff = endDate.getTime() - startDate.getTime();
  previousStartDate.setTime(previousStartDate.getTime() - diff);
  previousEndDate.setTime(previousEndDate.getTime() - diff);

  // Use useSalesReport for the previous period (for comparison)
  const { data: previousSalesReport, isLoading: isPreviousLoading } =
    useSalesReport({
      startDate: previousStartDate,
      endDate: previousEndDate,
      propertyId,
    });

  const isLoading = isCurrentLoading || isPreviousLoading;

  const currentRevenue = salesReport?.transactionMetrics.totalRevenue || 0;
  const previousRevenue =
    previousSalesReport?.transactionMetrics.totalRevenue || 0;

  const revenueChange = (() => {
    if (isLoading) return null;

    if (previousRevenue === 0) {
      if (currentRevenue === 0) return 0;
      return "New";
    }

    return Number(
      (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(2),
    );
  })();

  const totalTransactions =
    salesReport?.transactionMetrics.totalTransactions || 0;
  const averageBookingDuration =
    salesReport?.transactionMetrics.averageBookingDuration || 0;
  const totalProperties = salesReport?.propertyMetrics.length || 0;
  const totalRooms =
    salesReport?.propertyMetrics.reduce(
      (total, property) => total + property.totalRooms,
      0,
    ) || 0;

  const averageOccupancy = salesReport?.propertyMetrics.length
    ? Math.max(
        0,
        salesReport.propertyMetrics.reduce(
          (acc, curr) => acc + Math.max(0, curr.occupancyRate),
          0,
        ) / salesReport.propertyMetrics.length,
      )
    : 0;

  if (isLoading) {
    return <StatCardsSkeletonList />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-6">
      <CardDataStats
        title="Total Revenue"
        total={formatCurrency(currentRevenue)}
        rate={
          revenueChange === "New" ? "New" : `${Math.abs(revenueChange || 0)}%`
        }
        levelUp={
          revenueChange === "New" ||
          (typeof revenueChange === "number" && revenueChange > 0)
        }
        levelDown={typeof revenueChange === "number" && revenueChange < 0}
      >
        <DollarSign className="h-6 w-6" />
      </CardDataStats>

      <CardDataStats
        title="Total Transactions"
        total={totalTransactions.toString()}
        rate={`${averageBookingDuration} days`}
        levelUp
      >
        <ShoppingCart className="h-6 w-6" />
      </CardDataStats>

      <CardDataStats
        title="Total Properties"
        total={totalProperties.toString()}
        rate={`${totalRooms} rooms`}
        levelUp
      >
        <Building2 className="h-6 w-6" />
      </CardDataStats>

      <CardDataStats
        title="Occupancy Rate"
        total={`${averageOccupancy.toFixed(1)}%`}
        rate="occupancy rate"
        levelUp={averageOccupancy > 50}
        levelDown={averageOccupancy <= 50}
      >
        <Percent className="h-6 w-6" />
      </CardDataStats>
    </div>
  );
};

export default StatCards;
