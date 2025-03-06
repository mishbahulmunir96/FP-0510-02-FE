import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, Hotel } from "lucide-react";

interface TransactionStayDetailsProps {
  checkInDate: string | null;
  checkOutDate: string | null;
  duration: number;
}

const TransactionStayDetails = ({
  checkInDate,
  checkOutDate,
  duration,
}: TransactionStayDetailsProps) => {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-medium text-gray-900">
        <CalendarDays className="h-4 w-4 text-blue-600" />
        Stay Details
      </h4>
      <div className="rounded-lg border p-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">Check-in</p>
            <p className="font-medium text-gray-900">
              {checkInDate
                ? format(new Date(checkInDate), "EEE, MMM dd yyyy")
                : "Not set"}
            </p>
          </div>

          <Hotel className="h-5 w-5 rotate-90 text-gray-400 sm:rotate-0" />

          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-500">Check-out</p>
            <p className="font-medium text-gray-900">
              {checkOutDate
                ? format(new Date(checkOutDate), "EEE, MMM dd yyyy")
                : "Not set"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Badge variant="secondary" className="text-sm">
            {duration} Night Stay
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TransactionStayDetails;
