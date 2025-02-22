import usePropertyReport from "@/hooks/api/statistic/useGetPropertyReport";
import useTransactionReport from "@/hooks/api/statistic/useGetTransactionsReport";
import { Building2, DollarSign, Percent, ShoppingCart } from "lucide-react";
import CardDataStats from "./CardDataStats";
import { formatCurrency } from "@/lib/utils";

interface StatCardsProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

const StatCards = ({ startDate, endDate, propertyId }: StatCardsProps) => {
  const { data: propertyData, isLoading: isPropertyLoading } =
    usePropertyReport({
      startDate,
      endDate,
      propertyId,
    });
  console.log("property data", propertyData);
  const { data: currentData, isLoading: isCurrentLoading } =
    useTransactionReport({
      startDate,
      endDate,
      propertyId,
    });

  const previousStartDate = new Date(startDate);
  const previousEndDate = new Date(endDate);
  const diff = endDate.getTime() - startDate.getTime();
  previousStartDate.setTime(previousStartDate.getTime() - diff);
  previousEndDate.setTime(previousEndDate.getTime() - diff);

  const { data: previousData, isLoading: isPreviousLoading } =
    useTransactionReport({
      startDate: previousStartDate,
      endDate: previousEndDate,
      propertyId,
    });

  const isLoading = isPropertyLoading || isCurrentLoading || isPreviousLoading;

  const currentRevenue = currentData?.totalRevenue || 0;
  const previousRevenue = previousData?.totalRevenue || 0;

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

  const totalTransactions = currentData?.totalTransactions || 0;
  const averageBookingDuration = currentData?.averageBookingDuration || 0;
  const totalProperties = propertyData?.length || 0;
  const totalRooms =
    propertyData?.reduce((total, property) => total + property.totalRooms, 0) ||
    0;
  const averageOccupancy = propertyData
    ? propertyData.reduce((acc, curr) => acc + curr.occupancyRate, 0) /
      propertyData.length
    : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <CardDataStats
          title="Total Revenue"
          total="Loading..."
          rate="Calculating..."
        >
          <DollarSign className="h-5 w-5" />
        </CardDataStats>

        <CardDataStats
          title="Total Transaction"
          total="Loading..."
          rate="Calculating..."
        >
          <ShoppingCart className="h-5 w-5" />
        </CardDataStats>

        <CardDataStats
          title="Total Property"
          total="Loading..."
          rate="Calculating..."
        >
          <Building2 className="h-5 w-5" />
        </CardDataStats>

        <CardDataStats
          title="Occupancy Rate"
          total="Loading..."
          rate="Calculating..."
        >
          <Percent className="h-5 w-5" />
        </CardDataStats>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
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
        <DollarSign className="h-5 w-5" />
      </CardDataStats>

      <CardDataStats
        title="Total Transaction"
        total={totalTransactions.toString()}
        rate={`${averageBookingDuration} hari`}
        levelUp
      >
        <ShoppingCart className="h-5 w-5" />
      </CardDataStats>

      <CardDataStats
        title="Total Property"
        total={totalProperties.toString()}
        rate={`${totalRooms} kamar`}
        levelUp
      >
        <Building2 className="h-5 w-5" />
      </CardDataStats>

      <CardDataStats
        title="Occupancy Rate"
        total={`${averageOccupancy.toFixed(1)}%`}
        rate="tingkat hunian"
        levelUp={averageOccupancy > 50}
        levelDown={averageOccupancy <= 50}
      >
        <Percent className="h-5 w-5" />
      </CardDataStats>
    </div>
  );
};

export default StatCards;
