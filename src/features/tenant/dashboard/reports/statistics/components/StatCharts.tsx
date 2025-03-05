import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { Building2, DollarSign, Percent, ShoppingCart } from "lucide-react";
import CardDataStats from "./CardDataStats";
import { formatCurrency, calculateGrowthPercentage } from "@/lib/utils";
import { StatCardsSkeletonList } from "./LoadingSkeleton";

interface StatCardsProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

const StatCards = ({ startDate, endDate, propertyId }: StatCardsProps) => {
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

    return calculateGrowthPercentage(currentRevenue, previousRevenue);
  })();

  const currentTransactions =
    salesReport?.transactionMetrics.totalTransactions || 0;
  const previousTransactions =
    previousSalesReport?.transactionMetrics.totalTransactions || 0;

  const transactionsChange = (() => {
    if (isLoading) return null;

    if (previousTransactions === 0) {
      if (currentTransactions === 0) return 0;
      return "New";
    }

    return calculateGrowthPercentage(currentTransactions, previousTransactions);
  })();

  const currentOccupancy = salesReport?.propertyMetrics.length
    ? Math.max(
        0,
        salesReport.propertyMetrics.reduce(
          (acc, curr) => acc + Math.max(0, curr.occupancyRate),
          0,
        ) / salesReport.propertyMetrics.length,
      )
    : 0;

  const previousOccupancy = previousSalesReport?.propertyMetrics.length
    ? Math.max(
        0,
        previousSalesReport.propertyMetrics.reduce(
          (acc, curr) => acc + Math.max(0, curr.occupancyRate),
          0,
        ) / previousSalesReport.propertyMetrics.length,
      )
    : 0;

  const occupancyChange = (() => {
    if (isLoading) return null;

    if (previousOccupancy === 0) {
      if (currentOccupancy === 0) return 0;
      return "New";
    }

    return calculateGrowthPercentage(currentOccupancy, previousOccupancy);
  })();

  const totalProperties = salesReport?.propertyMetrics.length || 0;
  const totalRooms =
    salesReport?.propertyMetrics.reduce(
      (total, property) => total + property.totalRooms,
      0,
    ) || 0;
  const averageBookingDuration =
    salesReport?.transactionMetrics.averageBookingDuration || 0;
  const totalTransactions = currentTransactions;

  if (isLoading) {
    return <StatCardsSkeletonList />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
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
        rate={
          transactionsChange === "New"
            ? "New"
            : `${Math.abs(transactionsChange || 0)}%`
        }
        levelUp={
          transactionsChange === "New" ||
          (typeof transactionsChange === "number" && transactionsChange > 0)
        }
        levelDown={
          typeof transactionsChange === "number" && transactionsChange < 0
        }
      >
        <ShoppingCart className="h-6 w-6" />
      </CardDataStats>

      <CardDataStats
        title="Total Properties"
        total={totalProperties.toString()}
        rate={`${totalRooms} rooms`}
      >
        <Building2 className="h-6 w-6" />
      </CardDataStats>

      <CardDataStats
        title="Occupancy Rate"
        total={`${currentOccupancy.toFixed(1)}%`}
        rate={
          occupancyChange === "New"
            ? "New"
            : `${Math.abs(occupancyChange || 0)}%`
        }
        levelUp={
          occupancyChange === "New" ||
          (typeof occupancyChange === "number" && occupancyChange > 0)
        }
        levelDown={typeof occupancyChange === "number" && occupancyChange < 0}
      >
        <Percent className="h-6 w-6" />
      </CardDataStats>
    </div>
  );
};

export default StatCards;
