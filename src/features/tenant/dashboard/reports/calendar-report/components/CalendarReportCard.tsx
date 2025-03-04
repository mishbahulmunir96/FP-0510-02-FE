"use client";
<<<<<<< HEAD
import React, { useCallback, useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
=======
import React, { useCallback, useRef, useState } from "react";
>>>>>>> 5d8a0be1228781fedb1fa034b7e16873b050b305
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
<<<<<<< HEAD
import {
  Building2,
  Calendar,
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
=======
import { Calendar as CalendarIcon } from "lucide-react";
>>>>>>> 5d8a0be1228781fedb1fa034b7e16873b050b305
import CalendarLoadingSkeleton from "./CalendarLoadingSkeleton";
import NoPropertyCard from "./NoPropertyCard";
import ErrorCalendarCard from "./ErrorCalendarCard";
import RoomDetailModal from "./RoomDetailModal";

import "./calendar-styles-base.css";
import "./calendar-styles-components.css";
import {
  formatDate,
  getCalendarOptions,
  getDayCellHtml,
} from "@/utils/calendarUtils";

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
  const isUpdatingProgrammatically = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handleMonthChange = (direction: "prev" | "next") => {
    if (!calendarRef.current) return;

    isUpdatingProgrammatically.current = true;

    const calendarApi = calendarRef.current.getApi();
    if (direction === "prev") {
      calendarApi.prev();
    } else {
      calendarApi.next();
    }

    const newStart = calendarApi.view.currentStart;
    const newEnd = calendarApi.view.currentEnd;

    setStartDate(formatDate(newStart));
    setEndDate(formatDate(new Date(newEnd.getTime() - 86400000)));
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
      if (isUpdatingProgrammatically.current) {
        isUpdatingProgrammatically.current = false;
        return;
      }

      const formattedStartDate = formatDate(start);
      const formattedEndDate = formatDate(new Date(end.getTime() - 86400000));

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    },
    [setStartDate, setEndDate],
  );

  const dayCellContent = (args: { date: Date; dayNumberText: string }) => {
    return getDayCellHtml(args, reportData, roomIdParam);
  };

  const handleTodayClick = () => {
    if (!calendarRef.current) return;
    calendarRef.current.getApi().today();

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

<<<<<<< HEAD
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
            <div class="text-xs font-medium flex justify-between"><span>Total:</span> <span class="font-semibold">${totalRooms}</span></div>
            <div class="text-xs font-medium flex justify-between"><span>Booked:</span> <span class="font-semibold">${bookedRooms}</span></div>
            <div class="text-xs font-medium flex justify-between"><span>Available:</span> <span class="font-semibold">${availableRooms}</span></div>
            <div class="text-xs font-semibold mt-2 px-2 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-center">
              Rp ${formattedPrice} ${
                isPeak
                  ? '<span class="ml-1 px-1.5 py-0.5 text-[10px] bg-orange-100 text-orange-700 rounded-md">PEAK</span>'
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
          <div class="text-xs font-medium flex justify-between"><span>Total:</span> <span class="font-semibold">${totalRooms}</span></div>
          <div class="text-xs font-medium flex justify-between"><span>Booked:</span> <span class="font-semibold">${totalBookedRooms}</span></div>
          <div class="text-xs font-medium flex justify-between"><span>Available:</span> <span class="font-semibold">${totalAvailableRooms}</span></div>
          ${isPeak ? '<div class="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100 mt-2 text-center">Peak Season</div>' : ""}
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
        <div class="day-cell ${bgColorClass} rounded-lg h-full ">
          <div class="day-number font-bold text-center flex justify-between items-center px-2">
            <span>${args.dayNumberText}</span>
            <span class="text-[10px] ${statusClass} px-1.5 py-0.5 rounded-md">${occupancyRate}%</span>
          </div>
          ${displayInfo}
        </div>
      </div>
    `;

    return { html };
=======
    setStartDate(formatDate(firstDay));
    setEndDate(formatDate(lastDay));
>>>>>>> 5d8a0be1228781fedb1fa034b7e16873b050b305
  };

  const calendarOptions = {
    ...getCalendarOptions(handleMonthChange),
    customButtons: {
<<<<<<< HEAD
      prev: {
        text: "",
        click: () => handleMonthChange("prev"),
      },
      next: {
        text: "",
        click: () => handleMonthChange("next"),
      },
      today: {
        text: "Today",
        click: () => {
          if (!calendarRef.current) return;
          calendarRef.current.getApi().today();

          const today = new Date();
          const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDay = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
          );

          setStartDate(formatDate(firstDay));
          setEndDate(formatDate(lastDay));
        },
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
=======
      ...getCalendarOptions(handleMonthChange).customButtons,
      today: {
        text: "Today",
        click: handleTodayClick,
      },
>>>>>>> 5d8a0be1228781fedb1fa034b7e16873b050b305
    },
  };

  if (!propertyId) {
<<<<<<< HEAD
    return (
      <Card className="overflow-hidden border-gray-200 p-6 shadow-sm dark:border-gray-800">
        <CardContent className="flex h-[400px] items-center justify-center p-0">
          <div className="mx-auto max-w-md px-6 text-center">
            <div className="mb-6 inline-block rounded-full bg-gray-100 p-5 dark:bg-gray-800">
              <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">
              No Property Selected
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Please select a property from the dropdown above to view its
              availability calendar and occupancy data.
            </p>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Select a Property</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
=======
    return <NoPropertyCard />;
>>>>>>> 5d8a0be1228781fedb1fa034b7e16873b050b305
  }

  if (isLoading) return <CalendarLoadingSkeleton />;

<<<<<<< HEAD
  if (error)
    return (
      <Card className="overflow-hidden border-gray-200 p-6 shadow-sm dark:border-gray-800">
        <CardContent className="flex h-[400px] items-center justify-center p-0">
          <div className="mx-auto max-w-md px-6 text-center">
            <div className="mb-6 inline-block rounded-full bg-red-50 p-5 dark:bg-red-900/20">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Error Loading Data
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              There was a problem retrieving calendar data. Please try again
              later or contact support if the issue persists.
            </p>
            <Button onClick={() => window.location.reload()} className="gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Retry</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
=======
  if (error) return <ErrorCalendarCard />;
>>>>>>> 5d8a0be1228781fedb1fa034b7e16873b050b305

  return (
    <>
      <Card className="overflow-hidden border-gray-200 shadow-md transition-all duration-200 hover:shadow-lg dark:border-gray-800">
        <CardHeader className="border-b border-gray-200 bg-white pb-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="hidden h-5 w-5 text-blue-500 sm:block" />
              <CardTitle className="text-xl font-semibold leading-6">
                {reportData?.propertyName || "Property"} Availability Calendar
              </CardTitle>
            </div>

            <div className="inline-flex items-center rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800/50">
              <div className="flex flex-wrap items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-md border border-green-300 bg-green-100"></div>
                        <span className="text-xs font-medium">Low</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      <p>Low Occupancy (0-50%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-md border border-yellow-300 bg-yellow-100"></div>
                        <span className="text-xs font-medium">Medium</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      <p>Medium Occupancy (51-80%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-md border border-red-300 bg-red-100"></div>
                        <span className="text-xs font-medium">High</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      <p>High Occupancy (81-100%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex items-center justify-center pb-1 pt-2 text-center text-xs font-medium text-gray-500 md:hidden">
            <svg
              className="mr-1 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7-7 7"
              />
            </svg>
            Scroll horizontally to view more
          </div>
          <div className="calendar-scroll-container" ref={scrollContainerRef}>
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
          </div>
        </CardContent>
      </Card>

<<<<<<< HEAD
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedDay && (
          <DialogContent className="dialog-content overflow-hidden p-0 sm:max-w-[700px]">
            <DialogHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6 pb-3 dark:from-blue-900/20 dark:to-indigo-900/20">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white/90">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
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

            <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {selectedDay.rooms.map((room) => (
                  <Card
                    key={room.roomId}
                    className="room-card overflow-hidden border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <CardHeader className="bg-gray-50 p-4 pb-3 dark:bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">
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

                    <CardContent className="p-4">
                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="rounded-md bg-blue-50 p-2.5 dark:bg-blue-900/20">
                          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                            Availability
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-50">
                            {room.availableRooms} of {room.totalRooms} rooms
                          </p>
                        </div>
                        <div className="rounded-md bg-purple-50 p-2.5 dark:bg-purple-900/20">
                          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                            Occupancy Rate
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-50">
                            {room.occupancyRate}%
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="rounded-md bg-green-50 p-2.5 dark:bg-green-900/20">
                          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                            Price
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-50">
                            Rp {room.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-md bg-gray-50 p-2.5 dark:bg-gray-800/40">
                          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
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
                        <div className="mb-1.5 flex items-center justify-between">
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

            <DialogFooter className="border-t bg-gray-50 p-4 dark:bg-gray-800/30">
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
=======
      <RoomDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDay={selectedDay}
        propertyName={reportData?.propertyName}
      />
>>>>>>> 5d8a0be1228781fedb1fa034b7e16873b050b305
    </>
  );
};

export default CalendarReportCard;
