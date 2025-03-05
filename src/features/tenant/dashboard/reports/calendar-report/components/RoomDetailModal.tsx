import React from "react";
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
import { CalendarIcon } from "lucide-react";
import { DayCalendarData } from "@/types/calendar-report";

interface RoomDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDay: DayCalendarData | null;
  propertyName: string | undefined;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  isOpen,
  onOpenChange,
  selectedDay,
  propertyName,
}) => {
  if (!selectedDay) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            Property: {propertyName || "Property"}
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
                        <Badge variant="destructive" className="font-normal">
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
            onClick={() => onOpenChange(false)}
            className="rounded-md px-5 py-2 font-medium"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailModal;
