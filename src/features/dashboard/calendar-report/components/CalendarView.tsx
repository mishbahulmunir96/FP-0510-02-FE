// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from '@/components/ui/calendar';
// import { Loader2 } from 'lucide-react';
// import { RoomType } from '@/types/calendar-report';
// import usePropertyCalendarReport from '@/hooks/api/statistic/useGetCalendarReport';

// interface CalendarViewProps {
//   propertyId: number;
// }

// const CalendarView = ({ propertyId }: CalendarViewProps) => {
//   const [date, setDate] = useState<Date>(new Date());
//   const [selectedRoomType, setSelectedRoomType] = useState<RoomType | undefined>();

//   // Get first and last day of current month
//   const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
//   const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

//   const { data, isLoading } = usePropertyCalendarReport({
//     propertyId,
//     startDate,
//     endDate,
//     roomType: selectedRoomType,
//   });

//   // Function to format date to YYYY-MM-DD
//   const formatDate = (date: Date) => {
//     return date.toISOString().split('T')[0];
//   };

//   // Function to get day of month
//   const getDayOfMonth = (date: Date) => {
//     return date.getDate();
//   };

//   // Function to get room data for a specific date
//   const getRoomDataForDate = (date: Date) => {
//     const formattedDate = formatDate(date);
//     return data?.calendarData.find(d => d.date === formattedDate)?.rooms || [];
//   };

//   // Custom day render for calendar
//   const renderDay = (day: Date) => {
//     const roomData = getRoomDataForDate(day);
//     if (roomData.length === 0) return null;

//     return (
//       <div className="w-full h-full p-1">
//         <div className="text-xs font-semibold">{getDayOfMonth(day)}</div>
//         <div className="space-y-1 mt-1">
//           {roomData.map((room) => (
//             <div
//               key={room.roomId}
//               className="text-xs"
//             >
//               <div className="flex justify-between">
//                 <span>{room.roomName}</span>
//                 <span className={room.availableRooms === 0 ? 'text-red-500' : 'text-green-500'}>
//                   {room.availableRooms}/{room.totalRooms}
//                 </span>
//               </div>
//               <div className="flex justify-between text-gray-500">
//                 <span>{room.isPeakSeason ? '🌟 Peak' : ''}</span>
//                 <span>{room.occupancyRate}%</span>
//               </div>
//               {room.isNonAvailable && (
//                 <div className="text-red-500">Not Available</div>
//               )}
//               <div className="text-gray-500">
//                 ${room.price}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>Room Availability Calendar</CardTitle>
//         <Select
//           value={selectedRoomType}
//           onValueChange={(value) => setSelectedRoomType(value as RoomType)}
//         >
//           <SelectTrigger className="w-48">
//             <SelectValue placeholder="All Room Types" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value={undefined}>All Room Types</SelectItem>
//             {Object.values(RoomType).map((type) => (
//               <SelectItem key={type} value={type}>
//                 {type}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </CardHeader>
//       <CardContent>
//         <Calendar
//           mode="single"
//           selected={date}
//           onSelect={(newDate) => newDate && setDate(newDate)}
//           className="w-full h-full"
//           components={{
//             Day: ({ date }) => renderDay(date)
//           }}
//         />
//       </CardContent>
//     </Card>
//   );
// };

// export default CalendarView;
