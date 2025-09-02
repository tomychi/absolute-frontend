import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// Types for better type safety
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Helper functions for token management
const getStoredTokens = () => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) return null;

    const parsed = JSON.parse(authStorage);
    return parsed.state || null;
  } catch {
    return null;
  }
};

const updateStoredTokens = (
  accessToken: string,
  refreshToken: string,
  expiresAt: string,
) => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) return;

    const parsed = JSON.parse(authStorage);
    if (parsed.state) {
      parsed.state.accessToken = accessToken;
      parsed.state.refreshToken = refreshToken;
      parsed.state.expiresAt = expiresAt;
      localStorage.setItem("auth-storage", JSON.stringify(parsed));
    }
  } catch (error) {
    console.error("Failed to update stored tokens:", error);
  }
};

const clearStoredAuth = () => {
  try {
    localStorage.removeItem("auth-storage");
  } catch (error) {
    console.error("Failed to clear stored auth:", error);
  }
};

// Queue management for refresh token
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Refresh token function
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const storedAuth = getStoredTokens();
    if (!storedAuth?.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${api.defaults.baseURL}/api/auth/refresh`,
      {
        refreshToken: storedAuth.refreshToken,
      },
    );

    // Handle response structure (could be wrapped in data)
    const tokenData = response.data.data || response.data;
    const { accessToken, refreshToken, expiresAt } = tokenData;

    // Update stored tokens
    updateStoredTokens(accessToken, refreshToken, expiresAt);

    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearStoredAuth();
    // Redirect to login page
    window.location.href = "/login";
    return null;
  }
};

// Request interceptor - Add auth header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const storedAuth = getStoredTokens();

    if (storedAuth?.accessToken && storedAuth.isAuthenticated) {
      config.headers.Authorization = `Bearer ${storedAuth.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized responses
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is in progress, queue this request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          isRefreshing = false;
          onTokenRefreshed(newAccessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    const statusCode = error.response?.status || 500;
    const errors = error.response?.data?.errors;

    throw new ApiError(errorMessage, statusCode, errors);
  },
);

export { api, ApiError };
export type { ApiErrorResponse };
