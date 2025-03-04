"use client";
import React, { useCallback, useRef, useState } from "react";
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
import { Calendar as CalendarIcon } from "lucide-react";
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

    setStartDate(formatDate(firstDay));
    setEndDate(formatDate(lastDay));
  };

  const calendarOptions = {
    ...getCalendarOptions(handleMonthChange),
    customButtons: {
      ...getCalendarOptions(handleMonthChange).customButtons,
      today: {
        text: "Today",
        click: handleTodayClick,
      },
    },
  };

  if (!propertyId) {
    return <NoPropertyCard />;
  }

  if (isLoading) return <CalendarLoadingSkeleton />;

  if (error) return <ErrorCalendarCard />;

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

      <RoomDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDay={selectedDay}
        propertyName={reportData?.propertyName}
      />
    </>
  );
};

export default CalendarReportCard;
