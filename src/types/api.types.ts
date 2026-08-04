export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code?: string;
  data: T;
  errors?: {
    field: string;
    message: string;
  }[];
  timestamp?: string;
}
