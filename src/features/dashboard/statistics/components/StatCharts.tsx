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

export const StatCards = ({
  startDate,
  endDate,
  propertyId,
}: StatCardsProps) => {
  const { data: propertyData } = usePropertyReport({
    startDate,
    endDate,
    propertyId,
  });
  const { data: currentData } = useTransactionReport({
    startDate,
    endDate,
    propertyId,
  });

  // Hitung tanggal untuk periode sebelumnya
  const previousStartDate = new Date(startDate);
  const previousEndDate = new Date(endDate);
  const diff = endDate.getTime() - startDate.getTime();
  previousStartDate.setTime(previousStartDate.getTime() - diff);
  previousEndDate.setTime(previousEndDate.getTime() - diff);

  const { data: previousData } = useTransactionReport({
    startDate: previousStartDate,
    endDate: previousEndDate,
    propertyId,
  });

  // Hitung persentase perubahan
  const currentRevenue = currentData?.totalRevenue || 0;
  const previousRevenue = previousData?.totalRevenue || 0;
  const revenueChange =
    previousRevenue === 0
      ? 100
      : Number(
          (
            ((currentRevenue - previousRevenue) / previousRevenue) *
            100
          ).toFixed(2),
        );
  const totalTransactions = currentData?.totalTransactions || 0;
  const totalProperties = propertyData?.length || 0;
  const totalRooms =
    propertyData?.reduce((total, property) => {
      return total + property.totalRooms;
    }, 0) || 0;

  const averageOccupancy = propertyData
    ? propertyData.reduce((acc, curr) => acc + curr.occupancyRate, 0) /
      propertyData.length
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
      <CardDataStats
        title="Total Pendapatan"
        total={formatCurrency(currentRevenue)}
        rate={`${Math.abs(revenueChange)}%`}
        levelUp={revenueChange > 0}
        levelDown={revenueChange < 0}
      >
        <DollarSign className="h-5 w-5" />
      </CardDataStats>

      <CardDataStats
        title="Total Transaksi"
        total={totalTransactions.toString()}
        rate={`${currentData?.averageBookingDuration || 0} hari`}
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
        title="Rata-rata Occupancy"
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
