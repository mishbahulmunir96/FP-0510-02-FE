export interface PeakSeasonRate {
  id: number;
  startDate: string;
  endDate: string;
  price: number;
}

export interface PricingResult {
  totalPrice: number;
  nights: number;
  basePrice: number;
  peakSeasonDays: number;
  peakSeasonRatePerNight: number;
}

export const calculatePricing = (
  checkIn: Date,
  checkOut: Date,
  pricePerNight: number,
  peakSeasonRates: PeakSeasonRate[],
): PricingResult => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let totalPrice = 0;
  let peakSeasonDays = 0;
  let peakSeasonRatePerNight = 0;
  let basePrice = pricePerNight;

  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(checkIn);
    currentDate.setDate(currentDate.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);

    const isPeakSeason = peakSeasonRates.some((rate) => {
      const startDate = new Date(rate.startDate);
      const endDate = new Date(rate.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return currentDate >= startDate && currentDate <= endDate;
    });

    if (isPeakSeason) {
      const peakRate = peakSeasonRates.find((rate) => {
        const startDate = new Date(rate.startDate);
        const endDate = new Date(rate.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return currentDate >= startDate && currentDate <= endDate;
      });

      if (peakRate) {
        peakSeasonDays++;
        peakSeasonRatePerNight = peakRate.price;
        totalPrice += peakRate.price;
      }
    } else {
      totalPrice += basePrice;
    }
  }

  return {
    totalPrice,
    nights,
    basePrice,
    peakSeasonDays,
    peakSeasonRatePerNight,
  };
};
