import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BedDouble, Users } from "lucide-react";
import Image from "next/image";

interface PropertyDetailCardProps {
  roomId: string;
  name: string;
  imageUrl: string;
  guest: number;
  price: number;
  roomFacilities: Array<{ id: string; name: string }>;
}

export default function PropertyDetailCard({
  roomId,
  name,
  imageUrl,
  guest,
  price,
  roomFacilities,
}: PropertyDetailCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="object-cover"
          fill
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Up to {guest} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            <span>{guest > 1 ? `${guest} beds` : "1 bed"}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {roomFacilities.slice(0, 3).map((facility) => (
            <Badge key={facility.id} variant="secondary">
              {facility.name}
            </Badge>
          ))}
          {roomFacilities.length > 3 && (
            <Badge variant="secondary">+{roomFacilities.length - 3} more</Badge>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">${price}</span>
            <span className="text-muted-foreground"> / night</span>
          </div>
          <Button>Select</Button>
        </div>
      </div>
    </Card>
  );
}
