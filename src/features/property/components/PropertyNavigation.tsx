import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, differenceInDays } from "date-fns";
import { Building2, CalendarDays, Users } from "lucide-react";
import { locations } from "./Const";
import GuestSelector from "./Guest";

interface NavigationProps {
  onLocation: (location: string) => void;
  onCategory: (category: string) => void;
  onCheckIn: (date: Date) => void;
  onCheckOut: (date: Date) => void;
  onGuest: (guests: number) => void;
}

const categories = [
  { id: "hotel", name: "Hotel" },
  { id: "villa", name: "Villa" },
  { id: "apartment", name: "Apartment" },
];

const PropertyNavigation: React.FC<NavigationProps> = ({
  onLocation,
  onCategory,
  onCheckIn,
  onCheckOut,
  onGuest,
}) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (checkIn && checkOut) {
      const days = differenceInDays(checkOut, checkIn);
      setDuration(days > 0 ? days : 0);
    } else {
      setDuration(0);
    }
  }, [checkIn, checkOut]);

  const handleSearch = () => {
    if (selectedLocation) onLocation(selectedLocation);
    if (selectedCategory) onCategory(selectedCategory);
    if (checkIn) onCheckIn(checkIn);
    if (checkOut) onCheckOut(checkOut);
  };

  const handleReset = () => {
    setSelectedLocation("");
    setSelectedCategory("");
    setCheckIn(undefined);
    setCheckOut(undefined);
    onLocation("");
    onCategory("");
    onCheckIn(new Date());
    onCheckOut(new Date());
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[90%]">
        <div className="rounded-xl bg-white p-4 shadow-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Category */}
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Property Type
              </label>
              <div className="flex items-center gap-2">
                <Building2 className="absolute left-3 h-5 w-5 text-gray-400" />
                <select
                  className="w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select type</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Enter City or Location
              </label>
              <div className="flex items-center gap-2">
                <Building2 className="absolute left-3 h-5 w-5 text-gray-400" />
                <select
                  className="w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Check In */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Check In
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarDays className="mr-2 h-5 w-5 text-gray-400" />
                    {checkIn ? format(checkIn, "EEE MM/dd") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={(date) => setCheckIn(date ?? undefined)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check Out */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Check Out
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarDays className="mr-2 h-5 w-5 text-gray-400" />
                    {checkOut ? format(checkOut, "EEE MM/dd") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={(date) => setCheckOut(date ?? undefined)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/*  Guests*/}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Guests
                <GuestSelector onGuestChange={onGuest} />
              </label>
              {duration > 0 && (
                <span className="mt-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-sm">
                  {duration} {duration === 1 ? "night" : "nights"}
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex gap-4">
            <Button
              onClick={handleSearch}
              className="flex-1 bg-[#0194F3] px-8 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Search
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-24 px-4 py-2 font-semibold"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Most Searched Locations */}
        <div className="my-8">
          <h2 className="mb-6 text-2xl font-bold">Most Searched Locations</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {locations.map((location, index) => (
              <div
                key={index}
                className="flex-none cursor-pointer"
                onClick={() => {
                  setSelectedLocation(location.name);
                  onLocation(location.name);
                }}
              >
                <div
                  className={`relative h-[100px] w-[180px] overflow-hidden rounded-lg ${
                    selectedLocation === location.name
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <img
                    src={location.image}
                    alt={location.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-3">
                    <div className="font-medium text-white">
                      {location.name}
                    </div>
                    <div className="text-sm text-gray-200">
                      {location.places}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyNavigation;
