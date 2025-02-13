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
