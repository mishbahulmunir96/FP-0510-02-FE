import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionListSkeleton = () => {
  return (
    <div className="space-y-8 px-16">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <Card className="overflow-hidden">
        <Skeleton className="h-[100px] w-full" />
      </Card>
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <Skeleton className="h-48 w-full sm:h-[200px] sm:w-[200px]" />
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-6 w-[100px]" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-[120px]" />
                    <Skeleton className="h-12 w-[120px]" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TransactionListSkeleton;
