import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Users } from "lucide-react";

interface GuestSelectorProps {
  onGuestChange: (guests: number) => void;
}

type OperationType = "add" | "subtract";
type GuestType = "rooms" | "adults" | "children";

const GuestSelector: React.FC<GuestSelectorProps> = ({ onGuestChange }) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    onGuestChange(adults + children);
  }, [adults, children, onGuestChange]);

  const handleChange = (type: GuestType, operation: OperationType) => {
    let newValue: number;
    switch (type) {
      case "adults":
        newValue = operation === "add" ? adults + 1 : adults - 1;
        if (newValue >= 1 && newValue <= 10) setAdults(newValue);
        break;
      case "children":
        newValue = operation === "add" ? children + 1 : children - 1;
        if (newValue >= 0 && newValue <= 5) setChildren(newValue);
        break;
    }
  };

  const Counter = ({
    label,
    value,
    onDecrease,
    onIncrease,
  }: {
    label: string;
    value: number;
    onDecrease: () => void;
    onIncrease: () => void;
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onDecrease}
          className="h-8 w-8 rounded-full p-0"
        >
          -
        </Button>
        <span className="w-6 text-center">{value}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onIncrease}
          className="h-8 w-8 rounded-full p-0"
        >
          +
        </Button>
      </div>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-gray-400" />
            {` ${adults + children} guest${adults + children > 1 ? "s" : ""}`}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <h3 className="mb-4 font-medium"> guests</h3>

        <Counter
          label="Adults"
          value={adults}
          onDecrease={() => handleChange("adults", "subtract")}
          onIncrease={() => handleChange("adults", "add")}
        />
        <Counter
          label="Children"
          value={children}
          onDecrease={() => handleChange("children", "subtract")}
          onIncrease={() => handleChange("children", "add")}
        />
      </PopoverContent>
    </Popover>
  );
};

export default GuestSelector;
