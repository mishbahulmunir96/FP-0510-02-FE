// src/types/property.ts

export interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  status: "PUBLISHED" | "DRAFT";
  isDeleted: boolean;
  // Jika memang hanya mengizinkan nilai berikut, union type ini sudah tepat.
  // Jika ada kemungkinan nilai lain, pertimbangkan untuk menggantinya dengan string.
  category: "Hotel" | "Villa" | "Apartment";
  tenantId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  location: string;
  propertyImage: PropertyImage[];
  propertyFacility: PropertyFacility[];
  tenant: Tenant;
  room: Room[];
}

export interface PropertyImage {
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
  // Disesuaikan menjadi string jika backend mengembalikan data string
  bankNumber: string;
  balance: number;
  role: "TENANT";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
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
  // Menggunakan startDate dan endDate sesuai dengan schema
  startDate: string;
  endDate: string;
  isDeleted: boolean;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}
