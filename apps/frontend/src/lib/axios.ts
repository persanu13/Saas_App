import axios from "axios";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  timestamp: string;
};

type ApiError<T = string> = {
  statusCode: number;
  message: T;
  timestamp: string;
};

type ValidationMessage = {
  message: string;
  errors: Record<string, string[]>;
};

type AnyApiError = ApiError | ApiError<ValidationMessage>;

export const api = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data as AnyApiError),
);
