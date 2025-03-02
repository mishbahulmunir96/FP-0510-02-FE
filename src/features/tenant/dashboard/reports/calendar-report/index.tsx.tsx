"use client";
import React from "react";
import CalendarReportFilter from "./components/CalendarReportFilter";
import CalendarReportCard from "./components/CalendarReportCard";

const CalendarReportPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Property Calendar Report
        </h1>
        <p className="mt-2 max-w-3xl text-gray-600 dark:text-gray-400">
          View room availability, occupancy rates, and peak season information
          for your properties. Select a property to explore detailed calendar
          data.
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
