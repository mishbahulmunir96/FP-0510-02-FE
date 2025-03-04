import { DayCalendarData } from "@/hooks/api/statistic/useGetCalendarReport";

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getOccupancyStatusClasses = (
  occupancyRate: number,
): {
  bgColorClass: string;
  statusText: string;
  statusClass: string;
} => {
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

  return { bgColorClass, statusText, statusClass };
};

export const getDayCellHtml = (
  args: { date: Date; dayNumberText: string },
  reportData: any,
  roomIdParam: string | null,
): { html: string } => {
  if (!reportData) return { html: args.dayNumberText };

  const dateStr = formatDate(args.date);
  const dayData = reportData.calendarData.find(
    (day: any) => day.date === dateStr,
  );

  if (!dayData) return { html: args.dayNumberText };

  let displayInfo = "";
  let isPeak = false;

  if (roomIdParam) {
    const selectedRoom = dayData.rooms.find(
      (room: any) => room.roomId === parseInt(roomIdParam),
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
    isPeak = dayData.rooms.some((room: any) => room.isPeakSeason);

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
      (room: any) => room.roomId === parseInt(roomIdParam),
    );
    occupancyRate = selectedRoom ? selectedRoom.occupancyRate : 0;
  } else {
    occupancyRate = dayData.occupancyRate;
  }

  const { bgColorClass, statusClass } =
    getOccupancyStatusClasses(occupancyRate);

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
};

export const getCalendarOptions = (
  handleMonthChange: (direction: "prev" | "next") => void,
) => {
  return {
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
          return { type: "today" };
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
    },
  };
};
