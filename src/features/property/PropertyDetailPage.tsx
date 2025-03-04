"use client";

import PropertyDetailCard from "@/components/PropertyDetailCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetProperty from "@/hooks/api/property/useGetProperty";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Coffee, Heart, MapPin, Share, Star, Wifi } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { RoomPriceCalendar } from "./components/RoomPriceCalendar";
import { useRouter } from "next/navigation";
import {
  standardizeToCheckInTime,
  standardizeToCheckOutTime,
} from "@/utils/date";

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

// Dynamic import for Map component
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[450px] w-full items-center justify-center rounded-xl bg-gray-50">
      <div className="flex flex-col items-center text-gray-400">
        <Skeleton className="h-8 w-8 rounded-full" />
        <p className="mt-2 font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

// Function to format price (e.g., 200000 -> 200k)
const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${Math.floor(price / 1000)}k`;
  }
  return price.toString();
};

export default function PropertyDetailPage({
  propertySlug,
}: {
  propertySlug: string;
}) {
  const router = useRouter();
  const { data: property, isPending } = useGetProperty(propertySlug);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // State for tab control and map highlighting
  const [activeTab, setActiveTab] = useState("rooms");
  const [highlightMap, setHighlightMap] = useState(false);

  // Refs for scrolling
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  if (isPending) return <LoadingSkeleton />;
  if (!property) return <div>Property not found</div>;

  const availableRooms = property.room.filter((room) => !room.isDeleted);

  const selectedRoom = availableRooms.find(
    (room) => room.id.toString() === selectedRoomId,
  );

  const handleBooking = () => {
    if (!selectedRoom || !dateRange.from || !dateRange.to) return;

    const checkInDate = standardizeToCheckInTime(dateRange.from);
    const checkOutDate = standardizeToCheckOutTime(dateRange.to);

    const params = new URLSearchParams({
      roomId: selectedRoom.id.toString(),
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      propertyId: property.id.toString(),
      propertySlug: propertySlug,
    });

    router.push(`/transactions?${params.toString()}`);
  };

  const handlePositionChange = (lat: string, lng: string) => {
    console.log("Position changed:", lat, lng);
  };

  // Function to handle "Show on map" click
  const handleShowOnMap = () => {
    // Switch to the location tab
    setActiveTab("location");

    // Scroll to the tabs section first to ensure tab content is visible
    setTimeout(() => {
      if (tabsRef.current) {
        tabsRef.current.scrollIntoView({ behavior: "smooth" });

        // After tabs are in view and tab content is rendered, scroll to map
        setTimeout(() => {
          if (mapSectionRef.current) {
            mapSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            // Highlight the map temporarily
            setHighlightMap(true);
            setTimeout(() => setHighlightMap(false), 2000);
          }
        }, 300);
      }
    }, 100);
  };

  return (
    <main className="mx-auto my-8 max-w-screen-2xl px-4 sm:my-12 sm:px-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 text-sm text-gray-500">
        <span className="hover:text-primary hover:underline">Properties</span>
        <span className="mx-2">›</span>
        <span>{property.title}</span>
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        {/* Main Content Section */}
        <div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-3 lg:p-6">
          {/* Image Gallery Section */}
          <div className="space-y-4 lg:col-span-2">
            <div className="group relative h-[400px] overflow-hidden rounded-xl bg-gray-50 sm:h-[500px]">
              <Image
                src={
                  property.propertyImage[activeImageIndex]?.imageUrl ||
                  "/placeholder.jpg"
                }
                alt={property.title}
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                fill
                priority
              />

              {/* Image Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) => Math.max(0, prev - 1))
                  }
                  className="rounded-full bg-white/90 p-2.5 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white"
                  disabled={activeImageIndex === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      Math.min(property.propertyImage.length - 1, prev + 1),
                    )
                  }
                  className="rounded-full bg-white/90 p-2.5 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white"
                  disabled={
                    activeImageIndex === property.propertyImage.length - 1
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="absolute right-4 top-4 flex space-x-2">
                <button className="rounded-full bg-white/90 p-2 text-gray-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-rose-500">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="rounded-full bg-white/90 p-2 text-gray-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-blue-500">
                  <Share className="h-4 w-4" />
                </button>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {activeImageIndex + 1} / {property.propertyImage.length}
              </div>
            </div>

            {/* Horizontal Thumbnail Gallery */}
            <div className="grid grid-cols-6 gap-2">
              {property.propertyImage.slice(0, 6).map((image, index) => (
                <button
                  key={image.id}
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-md transition-all duration-200 hover:opacity-90 ${
                    index === activeImageIndex
                      ? "ring-2 ring-primary ring-offset-1"
                      : "opacity-70 hover:opacity-100"
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

            {/* Property Details & Description */}
            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                  >
                    {property.PropertyCategory?.[0]?.name}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    4.9 · <span className="underline">24 reviews</span>
                  </span>
                </div>

                <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                  {property.title}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{property.location}</span>
                  {/* Show on map link with onClick handler */}
                  <span
                    onClick={handleShowOnMap}
                    className="cursor-pointer text-sm font-medium text-primary underline transition-colors hover:text-primary/80"
                  >
                    Show on map
                  </span>
                </div>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>Hosted by </span>
                  <span className="ml-1 font-medium">
                    {property.tenant.name}
                  </span>
                  <div className="ml-2 h-6 w-6 overflow-hidden rounded-full bg-gray-100">
                    {/* Host avatar could go here */}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none text-gray-600">
                <p>{property.description}</p>
              </div>

              {/* Quick Facts */}
              <div className="mt-4 flex justify-between">
                <div className="flex-1 px-3 text-center">
                  <p className="text-xs text-gray-500">Available rooms</p>
                  <p className="mt-1 text-sm font-medium">
                    {availableRooms.length}
                  </p>
                </div>
                <div className="flex-1 border-x border-gray-100 px-3 text-center">
                  <p className="text-xs text-gray-500">Max capacity</p>
                  <p className="mt-1 text-sm font-medium">
                    {Math.max(...availableRooms.map((room) => room.guest))}{" "}
                    guests
                  </p>
                </div>
                <div className="flex-1 px-3 text-center">
                  <p className="text-xs text-gray-500">From</p>
                  <p className="mt-1 text-sm font-medium">
                    IDR{" "}
                    {formatPrice(
                      Math.min(...availableRooms.map((room) => room.price)),
                    )}
                    /night
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div>
            <div className="sticky top-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Book your stay
              </h3>

              {/* Custom styling for the RoomPriceCalendar to fix date format display */}
              <style jsx global>{`
                .date-input-placeholder {
                  font-family: inherit;
                  font-size: 0.875rem;
                  color: #6b7280;
                }

                /* Fix for DD/MM/YYYY display */
                input::placeholder {
                  letter-spacing: normal;
                  word-spacing: normal;
                }
              `}</style>

              <RoomPriceCalendar
                rooms={availableRooms}
                onRoomSelect={setSelectedRoomId}
                selectedRoomId={selectedRoomId}
                onDateChange={setDateRange}
                dateRange={dateRange}
              />

              <Button
                size="lg"
                className="mt-4 w-full bg-primary font-medium text-white shadow-sm transition-all hover:bg-primary/90"
                disabled={!selectedRoomId || !dateRange.from || !dateRange.to}
                onClick={handleBooking}
              >
                {selectedRoom ? `Book Now` : "Select Room & Dates"}
              </Button>

              {(!selectedRoomId || !dateRange.from || !dateRange.to) && (
                <p className="mt-2 text-center text-sm text-gray-500">
                  Please select a room and your stay dates
                </p>
              )}

              {/* Booking policies information */}
              <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Check-in</span>
                  <span className="font-medium">After 2:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Check-out</span>
                  <span className="font-medium">Before 11:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Cancellation</span>
                  <span className="font-medium">Free until 48h before</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Payment</span>
                  <span className="font-medium">Secure payment</span>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-6 rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-600">
                <p className="font-medium">Price guarantee</p>
                <p className="mt-1 text-xs">
                  You'll always get the best available rate when booking
                  directly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div ref={tabsRef}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="p-4 lg:p-6"
          >
            <TabsList className="w-full justify-start gap-6 border-b bg-transparent p-0">
              <TabsTrigger
                value="rooms"
                className="rounded-none border-b-2 border-transparent px-1 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Rooms & Availability
              </TabsTrigger>

              <TabsTrigger
                value="location"
                className="rounded-none border-b-2 border-transparent px-1 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Location
              </TabsTrigger>
            </TabsList>

            {/* Rooms Tab */}
            <TabsContent value="rooms" className="mt-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    roomFacilities={room.roomFacility.filter(
                      (f) => !f.isDeleted,
                    )}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Location Tab with Map */}
            <TabsContent value="location" className="mt-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Map section */}
                <div
                  ref={mapSectionRef}
                  className={`h-[450px] overflow-hidden rounded-lg transition-all duration-500 lg:col-span-2 ${
                    highlightMap
                      ? "shadow-lg shadow-primary/20 ring-2 ring-primary ring-opacity-50"
                      : "shadow-sm"
                  }`}
                >
                  <Map
                    selectedPosition={[property.latitude, property.longitude]}
                    onPositionChange={handlePositionChange}
                  />
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="mb-2 text-base font-medium text-gray-900">
                      About the area
                    </h3>
                    <p className="text-sm text-gray-600">
                      This property is located in {property.location}. The area
                      is known for its beautiful scenery and accessibility to
                      local attractions.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      Distances
                    </h4>
                    <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-500">
                          City center
                        </span>
                        <span className="text-sm font-medium">2.5 km</span>
                      </div>
                      <div className="border-t border-gray-50 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Nearest airport
                          </span>
                          <span className="text-sm font-medium">15 km</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-50 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Beach</span>
                          <span className="text-sm font-medium">3 km</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-50 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Restaurant
                          </span>
                          <span className="text-sm font-medium">0.5 km</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-50 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Supermarket
                          </span>
                          <span className="text-sm font-medium">1 km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-900">
                      Transportation
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Public transport available within 500m.</p>
                      <p>Free parking available on premises.</p>
                      <p>Taxi service available 24/7.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </main>
  );
}

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="mx-auto my-8 max-w-screen-2xl px-4 sm:my-12 sm:px-6">
    <Card className="overflow-hidden border-0 bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-3 lg:p-6">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-[400px] rounded-xl sm:h-[500px]" />
          <div className="grid grid-cols-6 gap-2">
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
          </div>
          <div className="space-y-3 pt-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
        <div>
          <Skeleton className="h-[550px] w-full rounded-xl" />
        </div>
      </div>
      <div className="p-4 lg:p-6">
        <div className="mb-5 flex gap-6">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-60 w-full rounded-lg" />
          <Skeleton className="h-60 w-full rounded-lg" />
          <Skeleton className="h-60 w-full rounded-lg" />
        </div>
      </div>
    </Card>
  </div>
);

// Facility icon utility function
const getFacilityIcon = (facilityName: string) => {
  const iconClass = "h-4 w-4 text-primary";

  switch (facilityName.toLowerCase()) {
    case "wifi":
      return <Wifi className={iconClass} />;
    case "coffee maker":
    case "coffee":
      return <Coffee className={iconClass} />;
    case "air conditioning":
    case "ac":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case "parking":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h8a2 2 0 012 2v10M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
          />
        </svg>
      );
    case "tv":
    case "television":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case "kitchen":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
  }
};
