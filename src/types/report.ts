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
