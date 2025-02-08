"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MapPin, Users, BedDouble, Wifi, Coffee } from "lucide-react";
import useGetProperty from "@/hooks/api/property/useGetProperty";
import PropertyDetailCard from "@/components/PropertyDetailCard";
import ReservationCard from "../transactions/components/ReservationCard";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Definisi tipe untuk Property
interface Property {
  id: number;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  location: string;
  tenant: {
    name: string;
  };
  PropertyCategory: Array<{
    name: string;
  }>;
  propertyImage: Array<{
    id: number;
    imageUrl: string | null;
  }>;
  propertyFacility: Array<{
    id: number;
    title: string;
    description: string;
  }>;
  room: Array<{
    id: number;
    type: string;
    guest: number;
    price: number;
    isDeleted: boolean;
    roomImage: Array<{
      imageUrl: string | null;
    }>;
    roomFacility: Array<{
      id: number;
      title: string;
      description: string;
      isDeleted: boolean;
    }>;
  }>;
}

// Dynamic import untuk Map component
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center bg-muted">
      Loading map...
    </div>
  ),
});

// Map Component
interface MapProps {
  selectedPosition: [string, string];
  onPositionChange: (lat: string, lng: string) => void;
}

const pointerIcon = new L.Icon({
  iconUrl: "/pin.png",
  iconSize: [35, 43],
  iconAnchor: [20, 58],
  popupAnchor: [0, -60],
});

export default function PropertyDetailPage({
  propertySlug,
}: {
  propertySlug: string;
}) {
  const { data: property, isPending } = useGetProperty(propertySlug);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (isPending) return <LoadingSkeleton />;
  if (!property) return <div>Property not found</div>;

  const availableRooms = property.room.filter((room) => !room.isDeleted);

  const handlePositionChange = (lat: string, lng: string) => {
    console.log("Position changed:", lat, lng);
  };

  return (
    <main className="mx-auto my-8 max-w-7xl px-4">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            <div className="relative h-[400px] overflow-hidden rounded-xl">
              <Image
                src={
                  property.propertyImage[activeImageIndex]?.imageUrl ||
                  "/placeholder.jpg"
                }
                alt={property.title}
                className="object-cover transition-all duration-300 hover:scale-105"
                fill
                priority
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {property.propertyImage.map((image, index) => (
                <button
                  key={image.id}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md ${
                    index === activeImageIndex ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="object-cover"
                    fill
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Property Details Section */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary">
                  {property.PropertyCategory?.[0]?.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Hosted by {property.tenant.name}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
            </div>

            <p className="text-muted-foreground">{property.description}</p>

            <Button size="lg" className="w-full">
              Book Now
            </Button>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="rooms" className="p-6">
          <TabsList>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {availableRooms.map((room) => (
                <PropertyDetailCard
                  key={room.id}
                  roomId={room.id}
                  name={room.type}
                  imageUrl={
                    room.roomImage[0]?.imageUrl || "/placeholder-room.jpg"
                  }
                  guest={room.guest}
                  price={room.price}
                  roomFacilities={room.roomFacility.filter((f) => !f.isDeleted)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="mt-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {property.propertyFacility.map((facility) => (
                <div key={facility.id} className="flex items-center gap-2">
                  {getFacilityIcon(facility.title)}
                  <span>{facility.description}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Location Tab with Map */}
          <TabsContent value="location" className="mt-6">
            <div className="h-[400px] overflow-hidden rounded-xl">
              <Map
                selectedPosition={[property.latitude, property.longitude]}
                onPositionChange={handlePositionChange}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="mx-auto my-8 max-w-7xl px-4">
    <Card>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <Skeleton className="h-[400px] rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="p-6">
        <Skeleton className="h-10 w-full" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </Card>
  </div>
);

// Utility function for facility icons
const getFacilityIcon = (facilityName: string) => {
  switch (facilityName.toLowerCase()) {
    case "wifi":
      return <Wifi className="h-5 w-5 text-primary" />;
    case "coffee maker":
      return <Coffee className="h-5 w-5 text-primary" />;
    default:
      return null;
  }
};
