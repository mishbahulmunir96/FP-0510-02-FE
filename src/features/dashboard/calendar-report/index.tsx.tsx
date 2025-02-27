"use client";
import React from "react";
import CalendarReportFilter from "./components/CalendarReportFilter";
import CalendarReportCard from "./components/CalendarReportCard";

const CalendarReportPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Property Calendar Report
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View room availability, occupancy rates, and peak season information
          for your properties
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
