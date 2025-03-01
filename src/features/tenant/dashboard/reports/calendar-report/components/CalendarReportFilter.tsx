"use client";
import React, { useCallback, useMemo } from "react";
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
import { useQueryState } from "nuqs";

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
  // Get params from URL
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
  console.log("data filter", salesReport);
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
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Property
            </label>
            <Select
              value={propertyIdParam || "none"}
              onValueChange={handlePropertyChange}
              disabled={salesReportLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a property</SelectItem>
                {salesReportLoading ? (
                  <div className="p-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="mt-2 h-5 w-full" />
                    <Skeleton className="mt-2 h-5 w-full" />
                  </div>
                ) : (
                  <>
                    {properties?.map((property) => (
                      <SelectItem
                        key={property.propertyId}
                        value={property.propertyId.toString()}
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
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Room
            </label>
            <Select
              value={roomIdParam || "all"}
              onValueChange={handleRoomChange}
              disabled={!propertyId || selectedPropertyRooms.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Rooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {selectedPropertyRooms.map((room) => (
                  <SelectItem key={room.roomId} value={room.roomId.toString()}>
                    {`${room.roomType} Room`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarReportFilter;
