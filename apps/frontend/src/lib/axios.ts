import axios from "axios";

export type ApiResponse<T> = {
  data: T;
  timestamp: string;
};

type ErrorDetail = {
  message: string;
  errors?: Record<string, string[]> | null;
  retryAfter?: number;
};

export type ApiError = {
  statusCode: number;
  details: ErrorDetail;
  timestamp: string;
};

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return Promise.reject(error.response.data);
      }
      if (error.request) {
        return Promise.reject({
          statusCode: 503,
          message: "Server don't work!",
          timestamp: new Date().toISOString(),
        });
      }
    }
    return Promise.reject({
      statusCode: 500,
      message: "Somethin went wrong!",
      timestamp: new Date().toISOString(),
    });
  },
);

type HttpClient = {
  get<T>(url: string, config?: any): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: any): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
};

export const api: HttpClient = {
  get: <T>(url: string, config?: any) =>
    axiosApi.get<ApiResponse<T>>(url, config).then((res) => res.data),
  post: <T>(url: string, data?: any, config?: any) =>
    axiosApi.post<ApiResponse<T>>(url, data, config).then((res) => res.data),
  put: <T>(url: string, data?: any, config?: any) =>
    axiosApi.put<ApiResponse<T>>(url, data, config).then((res) => res.data),
  delete: <T>(url: string, config?: any) =>
    axiosApi.delete<ApiResponse<T>>(url, config).then((res) => res.data),
  patch: <T>(url: string, data?: any, config?: any) =>
    axiosApi.patch<ApiResponse<T>>(url, data, config).then((res) => res.data),
};
