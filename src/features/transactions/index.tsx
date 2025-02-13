"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetRoom from "@/hooks/api/room/useGetRoom";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import BankDetail from "./components/BankDetail";
import InputElementDetail from "./components/InputElementDetail";
import PropertyRules from "./components/PropertyRules";
import ReservationCard from "./components/ReservationCard";

const TransactionPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn")
    ? new Date(searchParams.get("checkIn")!)
    : new Date();
  const checkOut = searchParams.get("checkOut")
    ? new Date(searchParams.get("checkOut")!)
    : new Date();

  const { data: roomDetail, isLoading, error } = useGetRoom(Number(roomId));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading room details</div>;

  const property = roomDetail?.property;

  return (
    <main className="w-full px-16">
      <div className="flex w-full justify-between">
        <div className="w-[60%] border-r py-8">
          <div className="mb-8">
            <div className="mb-4 flex flex-col gap-2">
              <ArrowLeft className="h-8 w-8" />
              <h1 className="text-2xl font-semibold text-slate-900">
                <span>Book: </span>
                {property?.title}, {property?.location}
              </h1>
            </div>
          </div>

          <div className="mb-8 border-b">
            <h2 className="mb-4 text-[20px] font-semibold text-gray-700">
              Step 1: Personal data
            </h2>
            <div className="mb-4 space-y-4">
              <InputElementDetail
                label="Name"
                placeholder="john doe"
                defaultValue={session?.user.name || ""}
              />
              <InputElementDetail
                label="Email address"
                placeholder="example@mail.com"
                defaultValue={session?.user.email || ""}
              />
            </div>
          </div>

          <div className="mb-8 border-b">
            <h2 className="mb-4 text-[20px] font-semibold text-gray-700">
              Step 2: Payment details
            </h2>
            <div className="mb-4 text-gray-600">
              <label className="mb-2 block text-sm font-medium">
                Choose payment method
              </label>

              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mb-2 w-[70%] rounded-full">
                  <SelectValue placeholder="Choose here" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automatic confirmation</SelectItem>
                  <SelectItem value="manual">Manual confirmation</SelectItem>
                </SelectContent>
              </Select>

              {paymentMethod === "manual" && (
                <div>
                  <h2>Please make the payment to this account Bank number</h2>
                  <BankDetail />
                </div>
              )}
            </div>
          </div>

          <PropertyRules />
        </div>

        <ReservationCard
          roomId={Number(roomId)}
          roomType={roomDetail?.type || ""}
          pricePerNight={roomDetail?.price || 0}
          checkIn={checkIn}
          checkOut={checkOut}
          roomImage={roomDetail?.roomImage[0]?.imageUrl || "/images/room.avif"}
          paymentMethod={paymentMethod}
          isLoggedIn={!!session}
          peakSeasonRates={roomDetail?.peakSeasonRate || []}
        />
      </div>
    </main>
  );
};

export default TransactionPage;
