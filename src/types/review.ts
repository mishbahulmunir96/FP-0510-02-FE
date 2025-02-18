export interface RoomReview {
  id: number;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    imageUrl: string | null;
  };
  reservation: {
    startDate: string;
    endDate: string;
    price: number;
    room: {
      type: "Deluxe" | "Standard" | "Suite";
      guest: number;
      images: Array<{
        imageUrl: string | null;
      }>;
      facilities: Array<{
        title: string;
        description: string;
      }>;
    };
  } | null;
}

export interface RoomReviewsResponse {
  data: RoomReview[];
  meta: {
    page: number;
    take: number;
    total: number;
    averageRating: number;
  };
}

export interface UseRoomReviewsParams {
  roomId: number;
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  enabled?: boolean;
}

export const getRatingLabel = (rating: number) => {
  if (rating >= 4.5) return "Outstanding";
  if (rating >= 4) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 3) return "Fair";
  return "Average";
};

export const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "bg-green-600";
  if (rating >= 4) return "bg-green-500";
  if (rating >= 3.5) return "bg-yellow-500";
  if (rating >= 3) return "bg-yellow-400";
  return "bg-gray-500";
};
