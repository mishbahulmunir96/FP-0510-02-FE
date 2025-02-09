import usePropertyReport from "@/hooks/api/statistic/useGetPropertyReport";
import useTransactionReport from "@/hooks/api/statistic/useGetTransactionsReport";
import { formatRupiah } from "@/lib/utils";
import {
  Building2,
  ShoppingCart,
  Users,
  Percent,
  DollarSign,
} from "lucide-react";
import CardDataStats from "./CardDataStats";

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
  const { data: transactionData } = useTransactionReport({
    startDate,
    endDate,
    propertyId,
  });
  const totalRevenue = transactionData?.totalRevenue || 0;
  const totalTransactions = transactionData?.totalTransactions || 0;
  const totalProperties = propertyData?.length || 0;
  const averageOccupancy = propertyData
    ? propertyData.reduce((acc, curr) => acc + curr.occupancyRate, 0) /
      propertyData.length
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
      <CardDataStats
        title="Total Pendapatan"
        total={formatRupiah(totalRevenue)}
        rate={`${transactionData?.paymentStatusBreakdown.successRate || 0}%`}
        levelUp
      >
        <DollarSign className="h-5 w-5" />
      </CardDataStats>

      <CardDataStats
        title="Total Transaksi"
        total={totalTransactions.toString()}
        rate={`${transactionData?.averageBookingDuration || 0} hari`}
        levelUp
      >
        <ShoppingCart className="h-5 w-5" />
      </CardDataStats>

      <CardDataStats
        title="Total Property"
        total={totalProperties.toString()}
        rate={`${propertyData?.[0]?.bestPerformingRooms.length || 0} kamar`}
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
