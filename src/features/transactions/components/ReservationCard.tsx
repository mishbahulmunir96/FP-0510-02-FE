"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SelectGuest from "./SelectGuest";
import { before } from "node:test";

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

const useDateRange = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const handleDateSelect = (newDateRange: DateRange | undefined) => {
    if (
      newDateRange &&
      newDateRange.from &&
      newDateRange.to &&
      newDateRange.from > newDateRange.to
    ) {
      setDateRange({ from: newDateRange.from, to: undefined });
    } else if (newDateRange !== undefined) {
      setDateRange(newDateRange);
    }
  };

  return { dateRange, setDateRange, handleDateSelect };
};

const today = new Date();
const disabledDay = [{ before: today }];

const ReservationCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { dateRange, setDateRange, handleDateSelect } = useDateRange();

  const buttonClasses = (date: Date | undefined) =>
    cn(
      "w-full justify-start text-left font-normal",
      !date && "text-muted-foreground",
    );

  return (
    <div className="mt-10 w-full md:w-[35%]">
      <Card className="w-full space-y-6 p-6">
        <div className="relative h-40 overflow-hidden rounded-md">
          <Image
            src="/images/room.avif"
            alt="Another view of bedroom"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#ff5722]">
              Rp 157.000
            </span>
            <span className="text-base text-muted-foreground">/ night</span>
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="mx-auto w-full">
            <div className="flex gap-2">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <div className="flex w-full justify-between divide-x">
                    <div
                      className={`${buttonClasses(dateRange.from)} flex h-full cursor-pointer flex-col gap-1 p-2`}
                      onClick={() => setIsOpen(true)}
                      aria-label="Pilih tanggal check-in"
                    >
                      <span className="text-xs font-semibold">CHECK-IN</span>
                      <div className="flex text-xs">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from
                          ? format(dateRange.from, "dd/MM/yyyy")
                          : "DD/MM/YYYY"}
                      </div>
                    </div>

                    <div
                      className={`${buttonClasses(dateRange.to)} flex h-full cursor-pointer flex-col gap-1 p-2`}
                      onClick={() => setIsOpen(true)}
                      aria-label="Pilih tanggal check-out"
                    >
                      <span className="text-xs font-semibold">CHECK-OUT</span>
                      <div className="flex text-xs">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to
                          ? format(dateRange.to, "dd/MM/yyyy")
                          : "DD/MM/YYYY"}
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex flex-col">
                    <Calendar
                      mode="range"
                      defaultMonth={new Date()}
                      selected={dateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                      showOutsideDays={false}
                      initialFocus
                      disabled={disabledDay}
                      classNames={{
                        months: "flex space-x-4",
                        head_row: "flex justify-between",
                        head_cell: "text-muted-foreground font-normal",
                        cell: cn(
                          "h-9 w-9 text-center text-sm p-0 relative",
                          "[&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                        ),
                        day: cn(
                          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                          "hover:bg-accent hover:text-accent-foreground",
                        ),
                        day_selected:
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle:
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                      }}
                    />

                    <div className="flex items-center justify-end gap-2 border-t p-3">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDateRange({
                            from: undefined,
                            to: undefined,
                          });
                        }}
                      >
                        Hapus tanggal
                      </Button>
                      <Button onClick={() => setIsOpen(false)}>Tutup</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <SelectGuest />
        </div>

        <Button className="w-full bg-[#E31C5F] py-6 text-lg hover:bg-[#D91557]">
          Pesan
        </Button>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <a href="#" className="font-medium underline">
              Rp 157.000 x 3 malam
            </a>
            <span className="font-medium">Rp12.720.000</span>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-base font-bold">Total pembayaran</span>
            <span className="font-bold">Rp14.219.134</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReservationCard;
