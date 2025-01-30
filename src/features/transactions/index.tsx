"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Car, Coffee, CreditCard, Wifi, Wind } from "lucide-react";
import { useState } from "react";
import BankDetail from "./components/BankDetail";
import InputElementDetail from "./components/InputElementDetail";
import PropertyRules from "./components/PropertyRules";
import ReservationCard from "./components/ReservationCard";
import { useSession } from "next-auth/react";

const TransactionPage = () => {
  const { data: session } = useSession();

  const [paymentMethod, setPaymentMethod] = useState("");
  return (
    <main className="w-full px-16">
      <div className="flex w-full justify-between">
        <div className="w-[60%] border-r">
          <div className="mb-8">
            <div className="mb-4 flex flex-col gap-2">
              <ArrowLeft className="h-8 w-8" />
              <h1 className="text-2xl font-semibold text-slate-900">
                <span>Book: </span>Atrium Premiere Hotel. Sleman, Yogyakarta
              </h1>
            </div>
          </div>

          <div className="mb-8 border-b">
            <h2 className="mb-4 text-[20px] font-semibold text-gray-700">
              Step 1: Personal data
            </h2>
            <div className="mb-4 space-y-4">
              <InputElementDetail label="Name" placeholder="maria oza" />
              <InputElementDetail
                label="Email address"
                placeholder="oza@mail.com"
              />
              <InputElementDetail
                label="Phone Number"
                placeholder="081234567890"
              />
            </div>
          </div>

          <div className="mb-8 border-b">
            <h2 className="mb-4 text-[20px] font-semibold text-gray-700">
              Step 2: Facilities
            </h2>

            <div className="mb-4">
              <div className="text-sm text-gray-700">
                <h2 className="mb-1 text-base font-medium">Hotel facilities</h2>
                <div className="mb-4 grid grid-cols-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>Free parking</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-700">
                <h2 className="mb-1 text-base font-medium">Room facilities</h2>
                <div className="mb-4 grid grid-cols-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Key card access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    <span>Air conditioning</span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    <span className="text-sm">Breakfast included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 border-b">
            <h2 className="mb-4 text-[20px] font-semibold text-gray-700">
              Step 3: Payment details
            </h2>
            <div className="mb-4 text-gray-700">
              <label className="mb-2 block text-base font-medium">
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

        <ReservationCard />
      </div>
    </main>
  );
};

export default TransactionPage;
