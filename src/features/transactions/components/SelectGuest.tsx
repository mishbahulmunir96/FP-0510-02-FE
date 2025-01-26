import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectGuest = () => {
  return (
    <div className="border-t">
      <Select defaultValue="1">
        <SelectTrigger className="h-16 w-full" aria-label="Pilih jumlah tamu">
          <div className="flex flex-col justify-center">
            <div className="items-start text-xs font-semibold">TAMU</div>
            <SelectValue placeholder="Pilih jumlah tamu" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 tamu</SelectItem>
          <SelectItem value="2">2 tamu</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectGuest;
