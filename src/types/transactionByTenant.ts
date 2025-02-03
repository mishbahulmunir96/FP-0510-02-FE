export enum PaymentMethod {
  MANUAL = "MANUAL",
  OTOMATIS = "OTOMATIS",
}

export enum PaymentStatus {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  WAITING_FOR_PAYMENT_CONFIRMATION = "WAITING_FOR_PAYMENT_CONFIRMATION",
  CANCELLED = "CANCELLED",
  PROCESSED = "PROCESSED",
}

export enum RoomType {
  Deluxe = "Deluxe",
  Standard = "Standard",
  Suite = "Suite",
}

export interface Customer {
  name: string;
  email: string;
  imageUrl: string;
}

export interface Reservation {
  roomType: RoomType;
  propertyTitle: string;
  roomPrice: number;
  propertyLocation: string;
  roomImages: (string | null)[];
  roomFacilities: string[];
  peakSeasonDays: number;
  peakSeasonPrice: number | null;
}

export interface Transaction {
  id: number;
  uuid: string;
  customer: Customer;
  totalPrice: number;
  paymentMethode: PaymentMethod;
  status: PaymentStatus;
  paymentProof: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  duration: number;
  updatedAt: string | null;
  reservations: Reservation[];
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
