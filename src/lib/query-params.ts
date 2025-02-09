// lib/query-params.ts
import { createParser } from "nuqs";
import { addDays } from "date-fns";

type FilterType = "date-range" | "month-year";

const numberParser = createParser({
  parse: (value: string) => parseInt(value, 10),
  serialize: (value: number) => value.toString(),
});

const dateParser = createParser({
  parse: (value: string) => value,
  serialize: (value: string) => value,
});

const filterTypeParser = createParser({
  parse: (value: string): FilterType =>
    value === "month-year" ? "month-year" : "date-range",
  serialize: (value: FilterType) => value,
});

// Buat tipe custom untuk propertyId
type PropertyId = number | null;
type PropertyIdParam = "all" | number;

// Modifikasi propertyIdParser
const propertyIdParser = createParser<PropertyIdParam>({
  parse: (value: string): PropertyIdParam => {
    if (!value) return "all";
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? "all" : parsed;
  },
  serialize: (value: PropertyIdParam) => value?.toString() ?? "all",
});

export const statisticQueryStates = {
  filterType: filterTypeParser.withDefault("date-range" as const),
  startDate: dateParser.withDefault(addDays(new Date(), -30).toISOString()),
  endDate: dateParser.withDefault(new Date().toISOString()),
  month: numberParser.withDefault(new Date().getMonth() + 1),
  year: numberParser.withDefault(new Date().getFullYear()),
  propertyId: propertyIdParser.withDefault("all"),
} as const;
