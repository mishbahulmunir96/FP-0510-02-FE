import SelectComponent from "@/components/SelectComponent";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const PaymentDetails = () => {
  return (
    <>
      <h2 className="mb-4 text-[20px] font-semibold text-gray-700">
        Step 3: Payment details
      </h2>
      <div className="mb-4 text-gray-700">
        <label className="mb-2 block text-base font-medium">
          Choose payment method
        </label>

        <SelectComponent
          placeholder="Automatic confirmation payment"
          value1="auto"
          value2="manual"
          children1="Automatic confirmation"
          children2="Manual confirmation"
        />

        <Card className="flex w-full max-w-md items-center justify-around space-y-6 p-6">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-muted">
            <Image
              src="/images/Logo_BRI.jpg"
              alt="Bank logo"
              fill
              className="object-cover opacity-70"
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Bank Name:</h3>
              <p className="text-sm text-muted-foreground">
                International Bank of
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Account Number:</h3>
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  1234 5678 9012 3456
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Account Holder's Name:</h3>
              <p className="text-sm text-muted-foreground">
                Alexander Hamilton
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default PaymentDetails;
