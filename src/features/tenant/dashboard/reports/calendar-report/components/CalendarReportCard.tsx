"use client";
import React, { useCallback, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCalendarReport, {
  DayCalendarData,
} from "@/hooks/api/statistic/useGetCalendarReport";
import { DateSelectArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import {
  usePropertyIdParam,
  useRoomIdParam,
  useStartDateParam,
  useEndDateParam,
} from "./CalendarReportFilter";
import { Building2 } from "lucide-react";
import CalendarLoadingSkeleton from "./CalendarLoadingSkeleton";

import "./calendar-styles.css";

const CalendarReportCard: React.FC = () => {
  const [propertyIdParam] = usePropertyIdParam();
  const [roomIdParam] = useRoomIdParam();
  const [startDateParam, setStartDate] = useStartDateParam();
  const [endDateParam, setEndDate] = useEndDateParam();

  const propertyId = propertyIdParam ? parseInt(propertyIdParam) : null;
  const roomId = roomIdParam ? parseInt(roomIdParam) : undefined;
  const startDate = startDateParam ? new Date(startDateParam) : new Date();
  const endDate = endDateParam ? new Date(endDateParam) : new Date();

  const [selectedDay, setSelectedDay] = useState<DayCalendarData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calendarRef = useRef<FullCalendar>(null);
  // Flag untuk mengetahui apakah perubahan tanggal dilakukan secara programatik
  const isUpdatingProgrammatically = useRef(false);

  const {
    data: reportData,
    isLoading,
    error,
  } = useCalendarReport({
    propertyId: propertyId as number,
    startDate,
    endDate,
    roomId,
  });

  // Helper function untuk memformat tanggal
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handler untuk navigasi bulan
  const handleMonthChange = (direction: "prev" | "next") => {
    if (!calendarRef.current) return;

    // Set flag bahwa kita sedang melakukan update secara programatik
    isUpdatingProgrammatically.current = true;

    // Navigasi calendar UI
    const calendarApi = calendarRef.current.getApi();
    if (direction === "prev") {
      calendarApi.prev();
    } else {
      calendarApi.next();
    }

    // Dapatkan tanggal baru setelah navigasi
    const newStart = calendarApi.view.currentStart;
    const newEnd = calendarApi.view.currentEnd;

    // Tetapkan tanggal baru untuk state dan query
    setStartDate(formatDate(newStart));
    setEndDate(formatDate(new Date(newEnd.getTime() - 86400000))); // Kurangi 1 hari
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (!reportData) return;

    const selectedDate = new Date(selectInfo.start);
    const formattedDate = formatDate(selectedDate);

    const dayData = reportData.calendarData.find(
      (day) => day.date === formattedDate,
    );

    if (dayData) {
      setSelectedDay(dayData);
      setIsModalOpen(true);
    }
  };

  const handleDatesSet = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      // Jangan update state jika perubahan dilakukan secara programatik
      if (isUpdatingProgrammatically.current) {
        isUpdatingProgrammatically.current = false;
        return;
      }

      // Jika perubahan dilakukan oleh pengguna, update state
      const formattedStartDate = formatDate(start);
      const formattedEndDate = formatDate(new Date(end.getTime() - 86400000)); // Kurangi 1 hari

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    },
    [setStartDate, setEndDate],
  );

  const dayCellContent = (args: { date: Date; dayNumberText: string }) => {
    if (!reportData) return { html: args.dayNumberText };

    const dateStr = formatDate(args.date);

    const dayData = reportData.calendarData.find((day) => day.date === dateStr);

    if (!dayData) return { html: args.dayNumberText };

    let displayInfo = "";
    let isPeak = false;

    if (roomIdParam) {
      const selectedRoom = dayData.rooms.find(
        (room) => room.roomId === parseInt(roomIdParam),
      );

      if (selectedRoom) {
        const totalRooms = selectedRoom.totalRooms;
        const bookedRooms = selectedRoom.bookedRooms;
        const availableRooms = selectedRoom.availableRooms;
        const price = selectedRoom.price;
        isPeak = selectedRoom.isPeakSeason;

        const formattedPrice = new Intl.NumberFormat("id-ID").format(price);

        displayInfo = `
          <div class="room-info">
            <div class="text-xs font-medium">Total: <span class="font-semibold">${totalRooms}</span></div>
            <div class="text-xs font-medium">Booked: <span class="font-semibold">${bookedRooms}</span></div>
            <div class="text-xs font-medium">Available: <span class="font-semibold">${availableRooms}</span></div>
            <div class="text-xs font-semibold mt-1.5 px-2 py-0.5 rounded-sm bg-blue-50 border border-blue-100 text-blue-700 inline-block">
              Rp ${formattedPrice} ${
                isPeak
                  ? '<span class="ml-1 px-1 py-0.5 text-[10px] bg-orange-100 text-orange-700 rounded-sm">PEAK</span>'
                  : ""
              }
            </div>
          </div>
        `;
      }
    } else {
      const totalRooms = dayData.totalRooms;
      const totalBookedRooms = dayData.totalBookedRooms;
      const totalAvailableRooms = dayData.totalAvailableRooms;
      isPeak = dayData.rooms.some((room) => room.isPeakSeason);

      displayInfo = `
        <div class="room-info">
          <div class="text-xs font-medium">Total: <span class="font-semibold">${totalRooms}</span></div>
          <div class="text-xs font-medium">Booked: <span class="font-semibold">${totalBookedRooms}</span></div>
          <div class="text-xs font-medium">Available: <span class="font-semibold">${totalAvailableRooms}</span></div>
          ${isPeak ? '<div class="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-100 mt-1.5 inline-block">Peak Season</div>' : ""}
        </div>
      `;
    }

    let occupancyRate;

    if (roomIdParam) {
      const selectedRoom = dayData.rooms.find(
        (room) => room.roomId === parseInt(roomIdParam),
      );
      occupancyRate = selectedRoom ? selectedRoom.occupancyRate : 0;
    } else {
      occupancyRate = dayData.occupancyRate;
    }

    let bgColorClass = "bg-green-50 border-green-100";
    let statusText = "Low";
    let statusClass = "text-green-700 bg-green-50 border border-green-100";

    if (occupancyRate > 50) {
      bgColorClass = "bg-yellow-50 border-yellow-100";
      statusText = "Medium";
      statusClass = "text-yellow-700 bg-yellow-50 border border-yellow-100";
    }
    if (occupancyRate > 80) {
      bgColorClass = "bg-red-50 border-red-100";
      statusText = "High";
      statusClass = "text-red-700 bg-red-50 border border-red-100";
    }

    const html = `
      <div class="day-cell-wrapper">
        <div class="day-cell ${bgColorClass} rounded h-full ">
          <div class="day-number font-bold text-center flex justify-between items-center px-1">
            <span>${args.dayNumberText}</span>
            <span class="text-[10px] ${statusClass} px-1 py-0.5 rounded-sm">${occupancyRate}%</span>
          </div>
          ${displayInfo}
        </div>
      </div>
    `;

    return { html };
  };

  const calendarOptions = {
    height: "auto",
    contentHeight: "auto",
    aspectRatio: 1.5,
    dayMaxEvents: true,
    fixedWeekCount: false,
    weekends: true,
    firstDay: 1,
    showNonCurrentDates: true,
    handleWindowResize: true,
    stickyHeaderDates: true,
    customButtons: {
      prev: {
        text: "Prev",
        click: () => handleMonthChange("prev"),
      },
      next: {
        text: "Next",
        click: () => handleMonthChange("next"),
      },
    },
    buttonText: {
      today: "Today",
      month: "Month",
    },
    buttonIcons: {
      prev: "chevron-left",
      next: "chevron-right",
      prevYear: "chevrons-left",
      nextYear: "chevrons-right",
    },
  };

  if (!propertyId) {
    return (
      <Card className="border-gray-200 p-6 shadow-sm dark:border-gray-800">
        <CardContent className="flex h-[400px] items-center justify-center">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-4 inline-block rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <Building2 className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
              No Property Selected
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please select a property from the dropdown above to view its
              availability calendar and occupancy data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) return <CalendarLoadingSkeleton />;

  if (error)
    return (
      <Card className="border-gray-200 p-6 shadow-sm dark:border-gray-800">
        <CardContent className="flex h-[400px] items-center justify-center">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-4 inline-block rounded-full bg-red-50 p-4 dark:bg-red-900/20">
              <svg
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
              Error Loading Data
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              There was a problem retrieving calendar data. Please try again
              later or contact support if the issue persists.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <>
      <Card className="overflow-hidden border-gray-200 shadow-sm dark:border-gray-800">
        <CardHeader className="border-b border-gray-200 bg-white pb-4 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-semibold">
              {reportData?.propertyName || "Property"} Availability Calendar
            </CardTitle>

            <div className="mt-3 inline-flex items-center rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50 sm:mt-0">
              <div className="flex flex-wrap items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-sm border border-green-300 bg-green-100"></div>
                        <span className="text-xs font-medium">Low</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Low Occupancy (0-50%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-sm border border-yellow-300 bg-yellow-100"></div>
                        <span className="text-xs font-medium">Medium</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Medium Occupancy (51-80%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-sm border border-red-300 bg-red-100"></div>
                        <span className="text-xs font-medium">High</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>High Occupancy (81-100%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="custom-calendar p-4">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              dayCellContent={dayCellContent}
              selectable={true}
              select={handleDateSelect}
              datesSet={handleDatesSet}
              {...calendarOptions}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedDay && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader className="border-b pb-2">
              <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {new Date(selectedDay.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500">
                Property: {reportData?.propertyName || "Property"}
              </p>
            </DialogHeader>

            <div className="custom-scrollbar max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                {selectedDay.rooms.map((room) => (
                  <Card
                    key={room.roomId}
                    className="overflow-hidden border-gray-200 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <CardHeader className="bg-gray-50 pb-2 dark:bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {room.roomName}
                        </CardTitle>
                        {room.isPeakSeason && (
                          <Badge
                            variant="outline"
                            className="border-orange-200 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          >
                            Peak Season
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Availability
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-50">
                            {room.availableRooms} of {room.totalRooms} rooms
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Occupancy Rate
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-50">
                            {room.occupancyRate}%
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Price
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-50">
                            Rp {room.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status
                          </p>
                          {room.isNonAvailable ? (
                            <Badge
                              variant="destructive"
                              className="font-normal"
                            >
                              Not Available
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-green-200 bg-green-100 font-normal text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            >
                              Available
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Occupancy Rate
                          </span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {room.occupancyRate}%
                          </span>
                        </div>
                        <Progress
                          value={room.occupancyRate}
                          className={`h-2.5 overflow-hidden rounded-full ${
                            room.occupancyRate > 80
                              ? "[&>div]:bg-red-500"
                              : room.occupancyRate > 50
                                ? "[&>div]:bg-yellow-500"
                                : "[&>div]:bg-green-500"
                          }`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-4 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md px-5 py-2 font-medium"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default CalendarReportCard;
