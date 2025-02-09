import usePropertyReport from "@/hooks/api/statistic/useGetPropertyReport";
import { formatRupiah } from "@/lib/utils";

interface TopPropertiesTableProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

export const TopPropertiesTable = ({
  startDate,
  endDate,
  propertyId,
}: TopPropertiesTableProps) => {
  const { data: properties } = usePropertyReport({
    startDate,
    endDate,
    propertyId,
  });
  const sortedProperties = properties
    ?.sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  return (
    <div className="border-stroke shadow-default sm:px-7.5 col-span-12 rounded-sm border bg-white px-5 pb-2.5 pt-6 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black">
        Property Terbaik
      </h4>

      <div className="flex flex-col">
        <div className="bg-gray-2 grid grid-cols-3 rounded-sm sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase">Nama Property</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase">Pendapatan</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase">Transaksi</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase">Occupancy</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase">Rating</h5>
          </div>
        </div>

        {sortedProperties?.map((property, index) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              index !== sortedProperties.length - 1
                ? "border-stroke border-b"
                : ""
            }`}
            key={property.propertyId}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black">{property.propertyName}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">
                {formatRupiah(property.totalRevenue)}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black">{property.totalTransactions}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{property.occupancyRate}%</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black">{property.averageRating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
