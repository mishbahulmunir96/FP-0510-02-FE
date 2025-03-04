import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar } from "lucide-react";

const NoPropertyCard = () => {
  return (
    <Card className="overflow-hidden border-gray-200 p-6 shadow-sm dark:border-gray-800">
      <CardContent className="flex h-[400px] items-center justify-center p-0">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mb-6 inline-block rounded-full bg-gray-100 p-5 dark:bg-gray-800">
            <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">
            No Property Selected
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Please select a property from the dropdown above to view its
            availability calendar and occupancy data.
          </p>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Select a Property</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoPropertyCard;
