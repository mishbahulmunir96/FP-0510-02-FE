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
    <div className="text-gray-700">
      <h2 className="mb-4 text-[20px] font-semibold">House rules</h2>
      <div className="space-y-4">
        <div className="flex w-[70%] justify-between">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <ClockArrowUp className="h-4 w-4" />
              <span>Check-in time</span>
            </div>
            <span className="ml-6">From 2 PM</span>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <ClockArrowDown className="h-4 w-4" />
              <span>Check-out time</span>
            </div>
            <span className="ml-6">Until 12 AM</span>
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            <span>No pets allowed</span>
          </div>
          <div className="flex items-center gap-2">
            <CigaretteOff className="h-4 w-4" />
            <span>No smoking</span>
          </div>
          <div className="flex items-center gap-2">
            <BeerOff className="h-4 w-4" />
            <span>No partying</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyRules;
