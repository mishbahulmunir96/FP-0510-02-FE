// // lib/query-params.ts
// import { createParser, parseAsInteger, parseAsStringEnum } from "nuqs";
// import { addDays, subYears } from "date-fns";

// type FilterType = "date-range" | "month-year";

// const numberParser = createParser({
//   parse: (value: string) => parseInt(value, 10),
//   serialize: (value: number) => value.toString(),
// });

// const dateParser = createParser({
//   parse: (value: string) => value,
//   serialize: (value: string) => value,
// });

// const filterTypeParser = createParser({
//   parse: (value: string): "date-range" | "month-year" | "year-only" =>
//     value === "month-year"
//       ? "month-year"
//       : value === "year-only"
//         ? "year-only"
//         : "date-range",
//   serialize: (value: "date-range" | "month-year" | "year-only") => value,
// });
// type PropertyIdParam = "all" | number;

// const propertyIdParser = createParser<PropertyIdParam>({
//   parse: (value: string): PropertyIdParam => {
//     if (!value) return "all";
//     const parsed = parseInt(value, 10);
//     return isNaN(parsed) ? "all" : parsed;
//   },
//   serialize: (value: PropertyIdParam) => value?.toString() ?? "all",
// });

// export const statisticQueryStates = {
//   filterType: filterTypeParser.withDefault("date-range" as const),
//   startDate: dateParser.withDefault(subYears(new Date(), 1).toISOString()),
//   endDate: dateParser.withDefault(new Date().toISOString()),
//   month: numberParser.withDefault(new Date().getMonth() + 1),
//   year: numberParser.withDefault(new Date().getFullYear()),
//   propertyId: propertyIdParser.withDefault("all"),
// } as const;

// type CalendarPropertyIdParam = "all" | number;

// const calendarPropertyIdParser = createParser<CalendarPropertyIdParam>({
//   parse: (value: string): CalendarPropertyIdParam => {
//     if (!value) return "all";
//     const parsed = parseInt(value, 10);
//     return isNaN(parsed) ? "all" : parsed;
//   },
//   serialize: (value: CalendarPropertyIdParam) => value?.toString() ?? "all",
// });

// export const calendarQueryStates = {
//   month: numberParser.withDefault(new Date().getMonth() + 1),
//   year: numberParser.withDefault(new Date().getFullYear()),
//   propertyId: calendarPropertyIdParser.withDefault("all"),
// } as const;
