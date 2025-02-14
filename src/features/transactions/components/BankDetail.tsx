import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const BankDetail = () => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg md:h-32 md:w-32">
          <Image
            src="/images/Logo_BRI.jpg"
            alt="Bank logo"
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Bank Name</h3>
            <p className="text-lg font-semibold text-gray-800">
              International Bank of Indonesia
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">
              Account Number
            </h3>
            <p className="font-mono text-lg font-semibold text-gray-800">
              1234 5678 9012 3456
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">
              Account Holder's Name
            </h3>
            <p className="text-lg font-semibold text-gray-800">
              Alexander Hamilton
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BankDetail;
