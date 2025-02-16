export interface Transaction {
  id: number;
  uuid: string;
  userId: number;
  totalPrice: number;
  paymentMethode: "MANUAL" | "OTOMATIS";
  status:
    | "WAITING_FOR_PAYMENT"
    | "WAITING_FOR_PAYMENT_CONFIRMATION"
    | "CANCELLED"
    | "PROCESSED"
    | "CHECKED_IN"
    | "CHECKED_OUT";
  paymentProof: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  duration: number;
  updatedAt: string | null;
  reservations: {
    roomType: "Deluxe" | "Standard" | "Suite";
    roomPrice: number;
    propertyTitle: string;
    propertyLocation: string;
    roomImages: {
      imageUrl: string | null;
    }[];
    roomFacilities: string[];
    peakSeasonDays: number;
    peakSeasonPrice: number;
    tenant: {
      name: string;
      imageUrl: string | null;
      phoneNumber: string | null;
      bankName: string;
      bankNumber: string;
    };
  }[];
}

export interface TransactionResponse {
  data: Transaction[];
  meta: {
    page: number;
    totalCount: number;
    take: number;
    total: number;
  };
}

export type SortOrder = "asc" | "desc";

export interface Filters {
  sortBy: string;
  sortOrder: SortOrder;
  startDate?: Date;
  endDate?: Date;
}
