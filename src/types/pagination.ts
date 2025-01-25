export interface PaginationQueries {
  take?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PageableResponse<T> {
  meta: any;
  message: string;
  data: {
    data: T[];
    meta: {
      total: number;
      totalCount: number;
      page: number;
      take: number;
    };
  };
}

export interface PaginationMeta {
  page: number;
  take: number;
  total: number;
}
