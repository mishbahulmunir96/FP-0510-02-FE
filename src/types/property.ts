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
  bankNumber: number;
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
  date: string;
  isDeleted: boolean;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}
