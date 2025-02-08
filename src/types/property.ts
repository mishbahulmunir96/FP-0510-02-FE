// src/types/property.ts

export interface Property {
  propertyCategory: any;
  city(province: (province: any, city: any) => unknown, city: any): unknown;
  province(province: any, city: any): unknown;
  id: number;
  slug: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  status: "PUBLISHED" | "DRAFT";
  isDeleted: boolean;
  propertyCategoryId: number;
  tenantId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  location: string;
  propertyImage: PropertyImage[];
  propertyFacility: PropertyFacility[];
  tenant: Tenant;
  room: Room[];
  PropertyCategory?: PropertyCategory[]; // Opsional: detail kategori
}

export interface PropertyImage {
  isDeleted: any;
  id: number;
  imageUrl?: string;
  propertyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFacility {
  id: number;
  title: string;
  description: string;
  isDeleted: boolean;
  propertyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: number;
  name: string;
  imageUrl?: string | null;
  phoneNumber?: string;
  userId: number;
  bankName: string;
  bankNumber: string;
  balance: number;
  role: "TENANT";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  name: string;
  id: number;
  type: "Deluxe" | "Standard" | "Suite";
  stock: number;
  price: number;
  guest: number;
  isDeleted: boolean;
  propertyId: number;
  createdAt: string;
  updatedAt: string;
  roomImage: RoomImage[];
  roomFacility: RoomFacility[];
  peakSeasonRate: PeakSeasonRate[];
  roomNonAvailability?: RoomNonAvailability[];
  reservation?: Reservation[];
}

export interface RoomImage {
  id: number;
  imageUrl?: string;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomFacility {
  id: number;
  title: string;
  description: string;
  isDeleted: boolean;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PeakSeasonRate {
  id: number;
  price: number;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomNonAvailability {
  id: number;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
  reason?: string;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: number;
  uuid: string;
  roomId: number;
  paymentId: number;
  price: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyCategory {
  id: number;
  name: string;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}
