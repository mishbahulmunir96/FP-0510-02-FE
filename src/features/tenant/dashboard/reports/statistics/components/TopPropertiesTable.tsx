"use client";
import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { formatCurrency } from "@/lib/utils";
import { TableSkeleton } from "./LoadingSkeleton";

interface TopPropertiesTableProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

export const TopPropertiesTable: React.FC<TopPropertiesTableProps> = ({
  startDate,
  endDate,
  propertyId,
}) => {
  const { data: salesReport, isLoading } = useSalesReport({
    startDate,
    endDate,
    propertyId,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  // Extract property metrics and sort by revenue
  const sortedProperties = salesReport?.propertyMetrics
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400" : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-500">
                Property Name
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-500">
                Revenue
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-500">
                Transactions
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-500">
                Occupancy
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-500">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProperties?.map((property) => (
              <tr
                key={property.propertyId}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {property.propertyName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(property.totalRevenue)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {property.totalTransactions}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${property.occupancyRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">
                      {property.occupancyRate}%
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    {renderRatingStars(property.averageRating)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({property.averageRating.toFixed(1)})
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {(!sortedProperties || sortedProperties.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No property data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPropertiesTable;
