import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

const TIMEZONE = "Asia/Jakarta";

export const standardizeToCheckInTime = (date: Date) => {
  const localDate = new Date(date);
  localDate.setHours(14, 0, 0, 0);
  return localDate;
};

export const standardizeToCheckOutTime = (date: Date) => {
  const localDate = new Date(date);
  localDate.setHours(12, 0, 0, 0);
  return localDate;
};

export const formatLocalDate = (date: Date) => {
  const zonedDate = toZonedTime(date, TIMEZONE);
 return format(zonedDate, "dd/MM/yyyy");
};
