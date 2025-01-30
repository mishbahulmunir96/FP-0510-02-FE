export interface Transaction {
  id: number;
  uuid: string;
  totalPrice: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  checkIn: string | null;
  checkOut: string | null;
  reservations: {
    roomType: string;
    propertyTitle: string;
    propertyLocation: string;
  }[];
}
