import { Input } from "@/components/ui/input";
import { FC } from "react";

interface InputElementDetailProps {
  label: string;
  placeholder: string;
  defaultValue: string;
}

const InputElementDetail: FC<InputElementDetailProps> = ({
  label,
  placeholder,
  defaultValue,
}) => {
  return (
    <div className="group relative transition-all duration-300">
      <label className="mb-2 block text-sm font-medium text-gray-700 transition-all group-focus-within:text-blue-600">
        {label}
      </label>
      <Input
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border-gray-200 bg-white px-4 shadow-sm transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:w-[70%]"
        defaultValue={defaultValue}
        disabled
        readOnly
      />
    </div>
  );
};

export default InputElementDetail;
