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
    | "PROCESSED";
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
    roomImages: string[];
    roomFacilities: string[];
  }[];
}

export interface TransactionResponse {
  data: Transaction[];
  meta: {
    page: number;
    take: number;
    total: number;
  };
}

export type SortOrder = "asc" | "desc";

export interface TransactionFilters {
  sortBy?: string;
  sortOrder?: SortOrder;
}
