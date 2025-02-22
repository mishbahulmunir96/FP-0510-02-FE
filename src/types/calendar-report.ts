// types/calendar.ts
export enum RoomType {
  Deluxe = "Deluxe",
  Standard = "Standard",
  Suite = "Suite",
}

export type RoomStatus = {
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
};

export type CalendarData = {
  date: string;
  rooms: RoomStatus[];
};

export type PropertyCalendarReport = {
  propertyId: number;
  propertyName: string;
  calendarData: CalendarData[];
};
