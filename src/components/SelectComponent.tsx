import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SelectComponentProps {
  placeholder: string;
  value1: string;
  value2: string;
  children1: string;
  children2: string;
}

const SelectComponent: FC<SelectComponentProps> = ({
  placeholder,
  value1,
  value2,
  children1,
  children2,
}) => {
  return (
    <Select>
      <SelectTrigger className="mb-2 w-[70%] rounded-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={value1}>{children1}</SelectItem>
        <SelectItem value={value2}>{children2}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
