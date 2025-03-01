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
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  usePropertyIdParam,
  useRoomIdParam,
  useStartDateParam,
  useEndDateParam,
} from "./CalendarReportFilter";

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

  console.log("data kalendder", reportData);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (!reportData) return;

    const selectedDate = new Date(selectInfo.start);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

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
      const startYear = start.getFullYear();
      const startMonth = String(start.getMonth() + 1).padStart(2, "0");
      const startDay = String(start.getDate()).padStart(2, "0");
      const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;

      const endYear = end.getFullYear();
      const endMonth = String(end.getMonth() + 1).padStart(2, "0");
      const endDay = String(end.getDate()).padStart(2, "0");
      const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    },
    [setStartDate, setEndDate],
  );

  const dayCellContent = (args: { date: Date; dayNumberText: string }) => {
    if (!reportData) return { html: args.dayNumberText };

    const year = args.date.getFullYear();
    const month = String(args.date.getMonth() + 1).padStart(2, "0");
    const day = String(args.date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

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
            <div class="text-xs">Total Room: ${totalRooms}</div>
            <div class="text-xs">Booked Room: ${bookedRooms}</div>
            <div class="text-xs">Available Room: ${availableRooms}</div>
            <div class="text-xs font-semibold mt-1">
              Rp ${formattedPrice} ${isPeak ? "(peak rate)" : ""}
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
          <div class="text-xs">Total Room: ${totalRooms}</div>
          <div class="text-xs">Booked Room: ${totalBookedRooms}</div>
          <div class="text-xs">Available Room: ${totalAvailableRooms}</div>
          ${isPeak ? '<div class="text-xs font-semibold text-orange-500 mt-1">Peak rate</div>' : ""}
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

    let bgColorClass = "bg-green-100";
    if (occupancyRate > 50) bgColorClass = "bg-yellow-100";
    if (occupancyRate > 80) bgColorClass = "bg-red-100";

    const html = `
      <div class="day-cell-wrapper">
        <div class="day-cell ${bgColorClass} rounded h-full">
          <div class="day-number font-bold text-center">${args.dayNumberText}</div>
          ${displayInfo}
        </div>
      </div>
    `;

    return { html };
  };

  const calendarOptions = {
    height: "auto",
    contentHeight: "auto",
    aspectRatio: 1.35,
    dayMaxEvents: true,
    fixedWeekCount: false,
  };

  if (!propertyId) {
    return (
      <Card className="p-6">
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Please select a property</p>
            <p className="mt-2 text-sm">
              Select a property to view its calendar report
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading)
    return (
      <Card className="p-6">
        <CardContent className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading calendar data...</p>
          </div>
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card className="p-6">
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center text-red-500">
            <p className="text-lg font-medium">Error loading calendar data</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please try again later
            </p>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm dark:border-gray-800">
      <CardHeader className="border-b border-gray-200 bg-white pb-4 dark:border-gray-700">
        <CardTitle className="text-xl font-semibold">
          {reportData?.propertyName || "Property"} Availability Calendar
        </CardTitle>

        <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-green-100"></div>
                    <span className="text-xs">Low</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Low Occupancy (0-50%)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-yellow-100"></div>
                    <span className="text-xs">Medium</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Medium Occupancy (51-80%)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-red-100"></div>
                    <span className="text-xs">High</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>High Occupancy (81-100%)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="custom-calendar p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            dayCellContent={dayCellContent}
            selectable={true}
            select={handleDateSelect}
            datesSet={(dateInfo) =>
              handleDatesSet({
                start: dateInfo.start,
                end: dateInfo.end,
              })
            }
            {...calendarOptions}
          />
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedDay && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {new Date(selectedDay.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DialogTitle>
            </DialogHeader>

            <div className="custom-scrollbar max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                {selectedDay.rooms.map((room) => (
                  <Card key={room.roomId} className="overflow-hidden">
                    <CardHeader className="pb-2">
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

                    <CardContent>
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Availability
                          </p>
                          <p className="font-medium">
                            {room.availableRooms} of {room.totalRooms} rooms
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Occupancy Rate
                          </p>
                          <p className="font-medium">{room.occupancyRate}%</p>
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium">
                            Rp {room.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
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

                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Occupancy
                          </span>
                          <span className="text-xs font-medium">
                            {room.occupancyRate}%
                          </span>
                        </div>
                        <Progress
                          value={room.occupancyRate}
                          className={`h-2 ${
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

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
};

export default CalendarReportCard;
