import { Property } from "./property";

export interface PropertyCategory {
  id: number;
  name: string;
  tenantId: number;
  createdAt: Date;
  updatedAt: Date;
  properties: Property[];
}
