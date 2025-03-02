"use client";

import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Loader2, Search, Map } from "lucide-react";
import { useMemo, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { format } from "date-fns";
import useGetProperties from "../../hooks/api/property/useGetProperties";
import PropertyCard from "../property/components/PropertyCard";
import PropertyNavigation from "./components/PropertyNavigation";
import PaginationSection from "../../components/PaginationSection";

export default function PropertyCatalogPage() {
  const [location, setLocation] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [guest, setGuest] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 500);
  const formattedStartDate = checkIn ? format(checkIn, "yyyy-MM-dd") : "";
  const formattedEndDate = checkOut ? format(checkOut, "yyyy-MM-dd") : "";

  // Active filters tracking
  const hasActiveFilters = location || category || checkIn || checkOut || guest;

  const { data, isLoading, isError } = useGetProperties({
    page,
    location,
    category,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    search: debouncedSearch,
    guest: guest,
  });

  const handleLocation = (loc: string) => {
    setLocation(loc);
    setPage(1);
  };

  const handleCategory = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  const handleCheckIn = (date: Date | undefined) => {
    setCheckIn(date);
    setPage(1);
  };

  const handleCheckOut = (date: Date | undefined) => {
    setCheckOut(date);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleGuest = (guests: number) => {
    setGuest(guests);
    setPage(1);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setLocation("");
    setCategory("");
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuest(undefined);
    setSearch("");
    setPage(1);
  };

  const propertyCards = useMemo(() => {
    return (
      data?.data?.data.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)",
          }}
          className="overflow-hidden rounded-xl bg-white shadow-lg"
        >
          <PropertyCard property={property} />
        </motion.div>
      )) ?? []
    );
  }, [data]);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-[#F0F9FF]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-4 max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl"
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
            <span className="text-5xl">🏠</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Oops!</h1>
          <p className="mt-6 text-xl text-gray-600">
            We couldn't load the properties right now. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-xl bg-blue-600 px-10 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top Navigation with PropertyNavigation component */}
      <div className="border-b bg-white py-6 shadow-md">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-7xl">
            <PropertyNavigation
              onLocation={handleLocation}
              onCategory={handleCategory}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onGuest={handleGuest}
            />
          </div>
        </div>
      </div>

      {/* Centered Search Bar - BIGGER */}
      <div className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative w-full md:mx-auto md:max-w-4xl">
            <Search className="absolute left-6 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-500" />
            <Input
              className="border-3 w-full rounded-full border-gray-200 bg-white py-6 pl-16 pr-6 text-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
              placeholder="Search properties name..."
              onChange={(e) => handleSearchChange(e.target.value)}
              value={search}
              aria-label="Search properties"
            />
          </div>
        </div>
      </div>

      {/* Filter Tags - Show selected filters - BIGGER */}
      {hasActiveFilters && (
        <div className="container mx-auto px-6 pb-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-3">
              {location && (
                <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                  {location}
                  <button
                    onClick={() => handleLocation("")}
                    className="ml-3 text-blue-400 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {category && (
                <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                  {category}
                  <button
                    onClick={() => handleCategory("")}
                    className="ml-3 text-blue-400 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {checkIn && (
                <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                  Check-in: {format(checkIn, "MMM dd, yyyy")}
                  <button
                    onClick={() => setCheckIn(undefined)}
                    className="ml-3 text-blue-400 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {checkOut && (
                <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                  Check-out: {format(checkOut, "MMM dd, yyyy")}
                  <button
                    onClick={() => setCheckOut(undefined)}
                    className="ml-3 text-blue-400 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {guest && (
                <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                  {guest} Guest{guest > 1 ? "s" : ""}
                  <button
                    onClick={() => setGuest(undefined)}
                    className="ml-3 text-blue-400 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="rounded-full bg-gray-200 px-5 py-2 text-base font-medium text-gray-700 hover:bg-gray-300"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Button - Only visible on mobile - BIGGER */}
      <div className="container mx-auto px-6 pb-6 md:hidden">
        <div className="mx-auto max-w-7xl">
          <button className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-lg font-medium text-gray-700 shadow-md">
            <Map className="h-6 w-6" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content Area - BIGGER spacing and elements */}
      <main className="container mx-auto flex-1 px-6 pb-16">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex h-80 flex-col items-center justify-center"
            >
              <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
              <span className="mt-6 text-xl font-medium text-gray-600">
                Finding your perfect stay...
              </span>
            </motion.div>
          ) : !data?.data?.data?.length ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex min-h-[60vh] flex-col items-center justify-center text-center"
            >
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-blue-100">
                <Search className="h-16 w-16 text-blue-500" />
              </div>
              <h3 className="mb-4 text-3xl font-medium text-gray-800">
                No properties found
              </h3>
              <p className="max-w-xl text-xl text-gray-600">
                We couldn't find any properties matching your criteria. Try
                adjusting your filters or search terms.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">
                  {data?.data?.meta?.total || ""} Properties Found
                </h2>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              >
                {propertyCards}
              </motion.div>

              {/* Pagination - BIGGER */}
              {data?.data?.meta && (
                <div className="mt-16">
                  <PaginationSection
                    page={data.data.meta.page}
                    take={data.data.meta.take}
                    total={data.data.meta.total}
                    onChangePage={handleChangePage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
