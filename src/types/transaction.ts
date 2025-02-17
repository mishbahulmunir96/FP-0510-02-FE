export enum TransactionStatus {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  WAITING_FOR_PAYMENT_CONFIRMATION = "WAITING_FOR_PAYMENT_CONFIRMATION",
  CANCELLED = "CANCELLED",
  PROCESSED = "PROCESSED",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
}

export enum PaymentMethod {
  MANUAL = "MANUAL",
  OTOMATIS = "OTOMATIS",
}

export enum RoomType {
  Deluxe = "Deluxe",
  Standard = "Standard",
  Suite = "Suite",
}

export interface Tenant {
  name: string;
  imageUrl: string | null;
  phoneNumber: string | null;
  bankName: string;
  bankNumber: string;
}

export interface Reservation {
  roomType: RoomType;
  roomPrice: number;
  propertyTitle: string;
  propertyLocation: string;
  propertyImages: string[];
  roomImages: {
    imageUrl: string | null;
  }[];
  roomFacilities: string[];
  tenant: Tenant;
}

export interface ReservationDetail {
  roomType: RoomType;
  roomPrice: number;
  propertyTitle: string;
  propertyLocation: string;
  propertyImages: string[];
  roomImages: string[];
  roomFacilities: string[];
  tenant: Tenant;
}

export interface Transaction {
  id: number;
  uuid: string;
  userId: number;
  totalPrice: number;
  paymentMethode: PaymentMethod;
  status: TransactionStatus;
  paymentProof: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  duration: number;
  updatedAt: string | null;
  reservations: Reservation[];
}

export interface TransactionDetail {
  id: number;
  uuid: string;
  userId: number;
  totalPrice: number;
  paymentMethode: PaymentMethod;
  status: TransactionStatus;
  paymentProof: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  duration: number;
  peakSeasonDays: number;
  peakSeasonPrice: number;
  updatedAt: string | null;
  reservations: ReservationDetail[];
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
