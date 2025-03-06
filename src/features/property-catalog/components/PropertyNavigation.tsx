import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, differenceInDays, format } from "date-fns";
import { CalendarDays, Filter, MapPin, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import GuestSelector from "../../property/components/Guest";
import { locations } from "./Const";

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
  useEffect(() => {
    if (checkIn && (!checkOut || checkIn >= checkOut)) {
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
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
        >
          <Filter className="h-4 w-4 text-primary" />
          <span>Filters</span>
        </Button>

        {showFilters && (
          <div className="absolute right-0 top-full z-50 mt-3 w-80 origin-top-right rounded-xl bg-white p-5 shadow-xl ring-1 ring-black/5 focus:outline-none md:w-[520px]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label className="mb-2.5 block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex cursor-pointer flex-col items-center rounded-lg border p-3 transition-all hover:border-primary/30 hover:bg-primary/5 ${
                        selectedCategory === cat.id
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-gray-200"
                      }`}
                    >
                      <span className="mb-1.5 text-xl">{cat.icon}</span>
                      <span className="text-xs font-medium">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2.5 block text-sm font-medium text-gray-700">
                  Enter City or Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-700 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg
                      className="h-4 w-4 fill-current text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-gray-700">
                    Check In
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-200 bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
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
                        className="rounded-lg border shadow-lg"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-gray-700">
                    Check Out
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-200 bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
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
                        className="rounded-lg border shadow-lg"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <label className="mb-2.5 block text-sm font-medium text-gray-700">
                  Guests
                </label>
                <GuestSelector onGuestChange={onGuest} />

                {duration > 0 && (
                  <div className="mt-3 rounded-lg bg-primary/10 p-2.5 text-center text-sm font-medium text-primary">
                    {duration} {duration === 1 ? "night" : "nights"} stay
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-primary font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-gray-200 bg-white font-medium text-gray-600 shadow-sm hover:bg-gray-50"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="my-8 hidden w-full md:block">
        <h2 className="mb-5 text-xl font-semibold text-gray-800">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                className={`relative h-40 overflow-hidden rounded-xl transition-all duration-300 ${
                  selectedLocation === location.name
                    ? "shadow-md ring-2 ring-primary"
                    : "ring-1 ring-gray-200"
                } group-hover:shadow-lg`}
              >
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="absolute bottom-4 left-4">
                    <div className="font-medium text-white">
                      {location.name}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-white/80">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span>Explore</span>
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
