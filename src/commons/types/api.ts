export type TApiResponse<T> = {
  data: T;
  message?: string;
  status_code?: number;
};

export type TApiPagination<T> = {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type TQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  [key: string]: unknown;
};
