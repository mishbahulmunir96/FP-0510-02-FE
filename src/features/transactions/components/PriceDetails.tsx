import { formatCurrency } from "@/lib/utils";
import { PricingResult } from "@/utils/reservationsPriceUtils";

interface PriceDetailsProps {
  pricingDetails: PricingResult;
}

const PriceDetails = ({ pricingDetails }: PriceDetailsProps) => {
  const {
    basePrice,
    nights,
    peakSeasonDays,
    peakSeasonRatePerNight,
    totalPrice,
  } = pricingDetails;

  return (
    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Base Price</span>
        <span className="font-medium text-gray-900">
          {formatCurrency(basePrice)}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Duration</span>
        <span className="font-medium text-gray-900">
          {nights} night{nights > 1 ? "s" : ""}
        </span>
      </div>

      {peakSeasonDays > 0 && (
        <>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Peak Season Rate</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(peakSeasonRatePerNight)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Peak Season Days</span>
            <span className="font-medium text-gray-900">{peakSeasonDays}</span>
          </div>
        </>
      )}

      <div className="border-t pt-3">
        <div className="flex justify-between">
          <span className="font-medium text-gray-900">Total Price</span>
          <span className="text-lg font-semibold text-blue-600">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
