import { api } from "../lib/api";
import type {
  AuthResponse,
  LoginData,
  RegisterData,
  AuthTokens,
  ApiResponse,
} from "./auth.types";

export const authApi = {
  // Login user
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      credentials,
    );
    return response.data.data;
  },

  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/register",
      userData,
    );
    return response.data.data;
  },

  // Refresh access token
  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post<ApiResponse<AuthTokens>>(
      "/api/auth/refresh",
      {
        refreshToken,
      },
    );
    return response.data.data;
  },

  // Logout current session
  logout: async (): Promise<void> => {
    await api.post("/api/auth/logout");
  },

  // Logout from all devices
  logoutAll: async (): Promise<void> => {
    await api.post("/api/auth/logout-all");
  },

  // Get current user profile (optional - if you have this endpoint)
  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};
