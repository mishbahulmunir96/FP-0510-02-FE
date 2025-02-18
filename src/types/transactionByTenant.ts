export enum PaymentMethod {
  MANUAL = "MANUAL",
  OTOMATIS = "OTOMATIS",
}

export enum PaymentStatus {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  WAITING_FOR_PAYMENT_CONFIRMATION = "WAITING_FOR_PAYMENT_CONFIRMATION",
  CANCELLED = "CANCELLED",
  PROCESSED = "PROCESSED",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
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
  propertyImages: string[];
  roomImages: {
    imageUrl: string | null;
  }[];
  roomFacilities: string[];
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

export interface ReservationDetail {
  roomId: number;
  roomType: RoomType;
  propertyTitle: string;
  roomPrice: number;
  propertyLocation: string;
  propertyImages: string[];
  roomImages: string[];
  roomFacilities: string[];
}

export interface TransactionDetail {
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
  peakSeasonDays: number;
  peakSeasonPrice: number | null;
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
