import {
  Ban,
  BeerOff,
  CigaretteOff,
  ClockArrowDown,
  ClockArrowUp,
} from "lucide-react";
import React from "react";

const PropertyRules = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">House Rules</h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div className="rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <ClockArrowUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Check-in Time</p>
                <p className="text-sm text-gray-600">From 2 PM</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <ClockArrowDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Check-out Time</p>
                <p className="text-sm text-gray-600">Until 12 AM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100">
            <div className="rounded-full bg-red-100 p-2">
              <Ban className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-medium text-gray-700">No pets allowed</span>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100">
            <div className="rounded-full bg-red-100 p-2">
              <CigaretteOff className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-medium text-gray-700">No smoking</span>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100">
            <div className="rounded-full bg-red-100 p-2">
              <BeerOff className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-medium text-gray-700">No partying</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyRules;
