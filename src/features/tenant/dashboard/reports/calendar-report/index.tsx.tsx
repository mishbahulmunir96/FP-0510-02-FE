"use client";
import React from "react";
import CalendarReportFilter from "./components/CalendarReportFilter";
import CalendarReportCard from "./components/CalendarReportCard";
import { CalendarRange } from "lucide-react";

const CalendarReportPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-800/40">
            <CalendarRange className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Property Calendar Report
          </h1>
        </div>
        <p className="mt-2 max-w-3xl leading-relaxed text-gray-600 dark:text-gray-400">
          View room availability, occupancy rates, and peak season information
          for your properties. Select a property to explore detailed calendar
          data and optimize your pricing strategy.
        </p>
      </div>

      <div className="space-y-6">
        <CalendarReportFilter />
        <CalendarReportCard />
      </div>
    </div>
  );
};

export default CalendarReportPage;
