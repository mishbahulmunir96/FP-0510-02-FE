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
    length: any;
    map(
      arg0: (
        category: import("./property").PropertyCategory,
      ) => import("react").JSX.Element,
    ): import("react").ReactNode;
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
