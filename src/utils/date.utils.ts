import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export const formatLocalDateTime = (utcDate: string) => {
  const date = parseISO(utcDate);
  return format(date, "dd MMMM yyyy", { locale: id });
};

// utils/date.utils.ts
export const getDateRangeParams = (
  filterType: "date-range" | "month-year" | "year-only",
  params: {
    startDate?: Date;
    endDate?: Date;
    month?: number;
    year?: number;
  },
): { startDate?: Date; endDate?: Date } => {
  const { startDate, endDate, month, year } = params;

  switch (filterType) {
    case "month-year": {
      if (!month || !year) return {};
      const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));
      const lastDayOfMonth = new Date(Date.UTC(year, month, 0));
      return { startDate: firstDayOfMonth, endDate: lastDayOfMonth };
    }
    case "year-only": {
      if (!year) return {};
      const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
      const lastDayOfYear = new Date(Date.UTC(year, 11, 31));
      return { startDate: firstDayOfYear, endDate: lastDayOfYear };
    }
    case "date-range": {
      return {
        startDate: startDate
          ? new Date(
              Date.UTC(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
              ),
            )
          : undefined,
        endDate: endDate
          ? new Date(
              Date.UTC(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate(),
              ),
            )
          : undefined,
      };
    }
    default:
      return { startDate: undefined, endDate: undefined };
  }
};
