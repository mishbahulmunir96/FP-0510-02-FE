export interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
  isVerified: boolean;
  role: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}
