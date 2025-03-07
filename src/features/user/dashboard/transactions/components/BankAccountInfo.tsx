import { Wallet } from "lucide-react";

interface BankAccount {
  bankName: string;
  bankNumber: string;
  name: string;
}

interface BankAccountInfoProps {
  bankAccount: BankAccount;
}

const BankAccountInfo = ({ bankAccount }: BankAccountInfoProps) => {
  return (
    <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50 p-4">
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-blue-600" />
        <h4 className="font-medium text-gray-900">Account Bank Information</h4>
      </div>
      <div className="space-y-1 pl-7">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Bank:</span> {bankAccount.bankName}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Account Number:</span>{" "}
          {bankAccount.bankNumber}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Account Holder:</span>{" "}
          {bankAccount.name}
        </p>
      </div>
      <p className="pl-7 text-xs text-blue-600">
        Please transfer the exact amount stated and upload the payment proof
      </p>
    </div>
  );
};

export default BankAccountInfo;
