export interface RoomDetail {
  roomId: number;
  roomType: "Deluxe" | "Standard" | "Suite";
  totalBookings: number;
  totalRevenue: number;
  averageStayDuration: number;
  stock: number;
}

export interface PropertyReport {
  propertyId: number;
  propertyName: string;
  totalRevenue: number;
  totalTransactions: number;
  occupancyRate: number;
  averageRating: number;
  roomDetails: RoomDetail[];
  bestPerformingRooms: RoomDetail[];
  totalRooms: number;
}

export interface PaymentMethodDistribution {
  MANUAL: {
    count: number;
    percentage: number;
  };
  OTOMATIS: {
    count: number;
    percentage: number;
  };
}

export interface PaymentStatusBreakdown {
  successRate: number;
  cancellationRate: number;
  pendingRate: number;
  totalSuccessful: number;
  totalCancelled: number;
  totalPending: number;
}

export interface PeriodData {
  date: string;
  totalBookings: number;
  totalRevenue: number;
}

export interface TransactionReport {
  totalTransactions: number;
  totalRevenue: number;
  averageTransactionValue: number;
  paymentMethodDistribution: PaymentMethodDistribution;
  paymentStatusBreakdown: PaymentStatusBreakdown;
  peakBookingPeriods: {
    date: string;
    totalBookings: number;
    totalRevenue: number;
  }[];
  averageBookingDuration: number;
  averageBookingLeadTime: number;
}

export interface RepeatCustomer {
  userId: number;
  name: string;
  totalBookings: number;
}

export interface TopSpender {
  userId: number;
  name: string;
  totalSpent: number;
  totalBookings: number;
  averageSpending: number;
}

export interface BookingPattern {
  userId: number;
  name: string;
  bookings: {
    totalBookings: number;
    averageStayDuration: number;
    preferredPaymentMethod: string;
    totalCancellations: number;
  };
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface UserReport {
  totalUniqueUsers: number;
  repeatCustomers: {
    count: number;
    percentage: number;
    users: RepeatCustomer[];
  };
  topSpenders: TopSpender[];
  bookingPatterns: BookingPattern[];
  averageSpendingPerUser: number;
  ratingDistribution: RatingDistribution[];
}

export type FilterType = "date-range" | "month-year" | "year-only";

export interface SalesReport {
  propertyMetrics: {
    propertyId: number;
    propertyName: string;
    totalRevenue: number;
    totalTransactions: number;
    occupancyRate: number;
    averageRating: number;
    totalRooms: number;
    roomDetails: {
      roomId: number;
      roomType: string;
      totalBookings: number;
      totalRevenue: number;
      averageStayDuration: number;
      stock: number;
    }[];
    bestPerformingRooms: {
      roomId: number;
      roomType: string;
      totalBookings: number;
      stock: number;
    }[];
  }[];

  transactionMetrics: {
    totalTransactions: number;
    totalRevenue: number;
    averageTransactionValue: number;
    paymentMethodDistribution: {
      MANUAL: { count: number; percentage: number };
      OTOMATIS: { count: number; percentage: number };
    };
    paymentStatusBreakdown: {
      successRate: number;
      cancellationRate: number;
      pendingRate: number;
      totalSuccessful: number;
      totalCancelled: number;
      totalPending: number;
    };
    peakBookingPeriods: {
      date: string;
      totalBookings: number;
      totalRevenue: number;
    }[];
    averageBookingDuration: number;
    averageBookingLeadTime: number;
  };
}

export interface DistributionChartProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

export type DataType = "transactions" | "revenue";

export interface ChartItem {
  name: string;
  value: number;
}

export interface RevenueChartProps {
  startDate: Date;
  endDate: Date;
  propertyId?: number | null;
}

export interface PeakBookingPeriod {
  date: string;
  totalRevenue: number;
  totalBookings: number;
}

export interface StatisticFiltersProps {
  filterType: FilterType;
  startDate: Date;
  endDate: Date;
  selectedMonth: number;
  selectedYear: number;
  selectedProperty: number | null;
  onFilterChange: (filters: {
    filterType?: FilterType;
    startDate?: Date;
    endDate?: Date;
    month?: number;
    year?: number;
    propertyId?: number | null;
  }) => void;
}

export interface Property {
  propertyId: number;
  propertyName: string;
}
