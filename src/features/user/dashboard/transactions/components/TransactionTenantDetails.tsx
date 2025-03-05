import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import Image from "next/image";

interface Tenant {
  name: string;
  imageUrl: string | null;
  bankName?: string;
  bankNumber?: string;
}

interface TransactionTenantDetailsProps {
  tenant: Tenant;
}

const TransactionTenantDetails = ({
  tenant,
}: TransactionTenantDetailsProps) => {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-medium text-gray-900">
        <User className="h-4 w-4 text-blue-600" />
        Tenant Details
      </h4>
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={tenant.imageUrl || "/images/profile_default.jpg"}
              alt={tenant.name}
              className="border border-green-500"
            />
            <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{tenant.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTenantDetails;
