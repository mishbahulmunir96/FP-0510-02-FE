import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const BankDetail = () => {
  return (
    <Card className="flex w-full max-w-md items-center justify-between space-x-6 rounded-lg bg-white p-8 shadow-md">
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
        <Image
          src="/images/Logo_BRI.jpg"
          alt="Bank logo"
          fill
          className="object-cover"
        />
      </div>
      <div className="w-full space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">Bank Name:</h3>
          <p className="text-lg text-gray-600">
            International Bank of Indonesia
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">
            Account Number:
          </h3>
          <div className="flex items-center gap-3">
            <p className="text-lg text-gray-600">1234 5678 9012 3456</p>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">
            Account Holder's Name:
          </h3>
          <p className="text-lg text-gray-600">Alexander Hamilton</p>
        </div>
      </div>
    </Card>
  );
};

export default BankDetail;
