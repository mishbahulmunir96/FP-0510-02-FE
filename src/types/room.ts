export interface Room {
    id: number;
    name: string;
    type: "Deluxe" | "Standard" | "Suite";
    isDeleted: boolean;
    propertyId: number;
    // ... other properties
  }