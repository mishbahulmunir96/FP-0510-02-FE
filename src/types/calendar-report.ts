export type RoomType = "Deluxe" | "Standard" | "Suite";

export interface RoomCalendarData {
  roomId: number;
  roomType: RoomType;
  roomName: string | null;
  basePrice: number;
  stock: number;
  bookedCount: number;
  availableCount: number;
  peakSeasonRate:
    | {
        date: string;
        price: number;
      }[]
    | null;
}

export interface DailyStats {
  date: string;
  totalBooked: number;
  totalAvailable: number;
  occupancyRate: number;
}

export interface CalendarReport {
  propertyId: number;
  propertyName: string;
  totalRooms: number;
  rooms: RoomCalendarData[];
  dailyStats: DailyStats[];
}

// For the calendar day data specifically
export interface CalendarDayData {
  date: string;
  rooms: {
    roomId: number;
    roomName: string;
    roomType: RoomType;
    totalRooms: number;
    bookedRooms: number;
    availableRooms: number;
    occupancyRate: number;
    isNonAvailable: boolean;
    isPeakSeason: boolean;
    price: number;
  }[];
}

export interface CalendarReportResponse {
  propertyId: number;
  propertyName: string;
  calendarData: CalendarDayData[];
}
