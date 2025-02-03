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
