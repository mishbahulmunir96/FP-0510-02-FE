import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, differenceInDays, addDays } from "date-fns";
import { Building2, CalendarDays, Users, MapPin, Home, X } from "lucide-react";
import { locations } from "./Const";
import GuestSelector from "../../property/components/Guest";

interface NavigationProps {
  onLocation: (location: string) => void;
  onCategory: (category: string) => void;
  onCheckIn: (date: Date) => void;
  onCheckOut: (date: Date) => void;
  onGuest: (guests: number) => void;
}

const categories = [
  { id: "hotel", name: "Hotel", icon: "🏨" },
  { id: "villa", name: "Villa", icon: "🏡" },
  { id: "apartment", name: "Apartment", icon: "🏢" },
  { id: "resort", name: "Resort", icon: "🌴" },
  { id: "cabin", name: "Cabin", icon: "🪵" },
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
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (checkIn && checkOut) {
      const days = differenceInDays(checkOut, checkIn);
      setDuration(days > 0 ? days : 0);
    } else {
      setDuration(0);
    }
  }, [checkIn, checkOut]);

  // Update checkout date automatically when checkin date changes
  useEffect(() => {
    if (checkIn && (!checkOut || checkIn >= checkOut)) {
      // Set checkout to checkin + 1 day by default
      setCheckOut(addDays(checkIn, 1));
    }
  }, [checkIn, checkOut]);

  const handleSearch = () => {
    if (selectedLocation) onLocation(selectedLocation);
    if (selectedCategory) onCategory(selectedCategory);
    if (checkIn) onCheckIn(checkIn);
    if (checkOut) onCheckOut(checkOut);
    setShowFilters(false);
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
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 shadow-sm"
        >
          <Home className="h-4 w-4" />
          <span>Filters</span>
        </Button>

        {showFilters && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 origin-top-right rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:w-[500px]">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex cursor-pointer flex-col items-center rounded-lg border p-3 transition-colors hover:bg-gray-50 ${
                        selectedCategory === cat.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <span className="mb-1 text-xl">{cat.icon}</span>
                      <span className="text-sm">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Enter City or Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Check In */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Check In
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-200 focus:ring-1 focus:ring-blue-500"
                      >
                        <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                        {checkIn
                          ? format(checkIn, "MMM dd, yyyy")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={(date) => setCheckIn(date ?? undefined)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check Out */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Check Out
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-200 focus:ring-1 focus:ring-blue-500"
                      >
                        <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                        {checkOut
                          ? format(checkOut, "MMM dd, yyyy")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={(date) => setCheckOut(date ?? undefined)}
                        initialFocus
                        disabled={(date) =>
                          checkIn ? date <= checkIn : date <= new Date()
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Guests
                </label>
                <GuestSelector onGuestChange={onGuest} />

                {duration > 0 && (
                  <div className="mt-2 rounded-md bg-blue-50 p-2 text-center text-sm text-blue-700">
                    {duration} {duration === 1 ? "night" : "nights"} stay
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-blue-600 font-medium text-white hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-gray-200 font-medium text-gray-600 hover:bg-gray-50"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Most Searched Locations */}
      <div className="my-6 hidden w-full md:block">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {locations.slice(0, 5).map((location, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => {
                setSelectedLocation(location.name);
                onLocation(location.name);
              }}
            >
              <div
                className={`relative h-40 overflow-hidden rounded-lg transition-all duration-300 ${
                  selectedLocation === location.name
                    ? "ring-2 ring-blue-500"
                    : "ring-1 ring-gray-200"
                } group-hover:shadow-md`}
              >
                <img
                  src={location.image}
                  alt={location.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                  <div className="absolute bottom-4 left-4">
                    <div className="font-medium text-white">
                      {location.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyNavigation;
