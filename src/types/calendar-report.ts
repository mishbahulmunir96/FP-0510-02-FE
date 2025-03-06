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

export interface CalendarRoomData {
  roomId: number;
  roomName: string;
  roomType: "Deluxe" | "Suite" | "Standard";
  totalRooms: number;
  bookedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  isNonAvailable: boolean;
  isPeakSeason: boolean;
  price: number;
}

export interface DayCalendarData {
  date: string;
  totalRooms: number;
  totalBookedRooms: number;
  totalAvailableRooms: number;
  occupancyRate: number;
  rooms: CalendarRoomData[];
}

export interface PropertyCalendarReport {
  propertyId: number;
  propertyName: string;
  calendarData: DayCalendarData[];
}
export interface PropertyCalendarReportResponse {
  status: string;
  data: PropertyCalendarReport;
}

export interface PropertyCalendarReportParams {
  propertyId: number;
  startDate: Date;
  endDate: Date;
  roomId?: number;
}
