"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import useSalesReport from "@/hooks/api/statistic/useGetSalesReport";
import { Building2, CalendarRange, Filter, Hotel } from "lucide-react";
import { useQueryState } from "nuqs";
import React, { useCallback, useMemo } from "react";

export const usePropertyIdParam = () => {
  return useQueryState("propertyId");
};

export const useRoomIdParam = () => {
  return useQueryState("roomId");
};

export const useStartDateParam = () => {
  return useQueryState("startDate", {
    defaultValue: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
  });
};

export const useEndDateParam = () => {
  return useQueryState("endDate", {
    defaultValue: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    )
      .toISOString()
      .split("T")[0],
  });
};

interface CalendarFiltersProps {}

const CalendarReportFilter: React.FC<CalendarFiltersProps> = () => {
  const [propertyIdParam, setPropertyId] = usePropertyIdParam();
  const [roomIdParam, setRoomId] = useRoomIdParam();
  const [startDateParam] = useStartDateParam();
  const [endDateParam] = useEndDateParam();

  const propertyId = propertyIdParam ? parseInt(propertyIdParam) : null;
  const startDate = startDateParam ? new Date(startDateParam) : new Date();
  const endDate = endDateParam ? new Date(endDateParam) : new Date();

  const { data: salesReport, isLoading: salesReportLoading } = useSalesReport({
    startDate,
    endDate,
  });

  const properties = useMemo(() => {
    return salesReport?.propertyMetrics || [];
  }, [salesReport]);

  const selectedPropertyRooms = useMemo(() => {
    if (!properties || !propertyId) return [];

    const property = properties.find((p) => p.propertyId === propertyId);
    if (!property) return [];

    return property.roomDetails;
  }, [properties, propertyId]);

  const handlePropertyChange = useCallback(
    (value: string) => {
      setPropertyId(value === "none" ? null : value);
      setRoomId(null);
    },
    [setPropertyId, setRoomId],
  );

  const handleRoomChange = useCallback(
    (value: string) => {
      setRoomId(value === "all" ? null : value);
    },
    [setRoomId],
  );

  return (
    <Card className="overflow-hidden rounded-lg border-gray-200 shadow-md transition-all duration-200 hover:shadow-lg dark:border-gray-800">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center">
          <div className="mr-3 rounded-full bg-blue-50 p-2 dark:bg-blue-900/20">
            <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Filter Calendar View
          </h3>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Building2 className="h-4 w-4 text-gray-500" />
              Property
            </label>
            <Select
              value={propertyIdParam || "none"}
              onValueChange={handlePropertyChange}
              disabled={salesReportLoading}
            >
              <SelectTrigger className="w-full rounded-md border-gray-300 bg-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 dark:border-gray-700 dark:bg-gray-800">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent className="max-h-80 overflow-y-auto">
                <SelectItem value="none" className="text-gray-500">
                  Select a property
                </SelectItem>
                {salesReportLoading ? (
                  <div className="space-y-2 p-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ) : (
                  <>
                    {properties?.map((property) => (
                      <SelectItem
                        key={property.propertyId}
                        value={property.propertyId.toString()}
                        className="py-2.5"
                      >
                        {property.propertyName}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Hotel className="h-4 w-4 text-gray-500" />
              Room Type
            </label>
            <Select
              value={roomIdParam || "all"}
              onValueChange={handleRoomChange}
              disabled={!propertyId || selectedPropertyRooms.length === 0}
            >
              <SelectTrigger className="w-full rounded-md border-gray-300 bg-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 dark:border-gray-700 dark:bg-gray-800">
                <SelectValue placeholder="All Rooms" />
              </SelectTrigger>
              <SelectContent className="max-h-80 overflow-y-auto">
                <SelectItem
                  value="all"
                  className="py-2.5 font-medium text-blue-600 dark:text-blue-400"
                >
                  All Rooms
                </SelectItem>
                {selectedPropertyRooms.map((room) => (
                  <SelectItem
                    key={room.roomId}
                    value={room.roomId.toString()}
                    className="py-2.5"
                  >
                    {`${room.roomType} Room`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!propertyId && (
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Please select a property first
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarReportFilter;
