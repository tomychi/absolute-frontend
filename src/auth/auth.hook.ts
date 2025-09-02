import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./auth.store";
import { authApi } from "./auth.api";
import { ApiError } from "../lib/api";
import type { LoginData, RegisterData } from "./auth.types";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const {
    user,
    isAuthenticated,
    isLoading,
    selectedCompany,
    needsCompanySelection,
    setAuth,
    clearAuth,
    setLoading,
    updateTokens,
    setSelectedCompany,
    isTokenExpired,
    refreshToken: storedRefreshToken,
  } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      console.error("Login failed:", error.message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      console.error("Registration failed:", error.message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: (error: ApiError) => {
      // Even if logout fails on server, clear local state
      console.error("Logout failed:", error.message);
      clearAuth();
      queryClient.clear();
    },
  });

  // Logout from all devices mutation
  const logoutAllMutation = useMutation({
    mutationFn: authApi.logoutAll,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: (error: ApiError) => {
      // Even if logout fails on server, clear local state
      console.error("Logout all failed:", error.message);
      clearAuth();
      queryClient.clear();
    },
  });

  // Refresh token mutation
  const refreshMutation = useMutation({
    mutationFn: () => authApi.refresh(storedRefreshToken!),
    onSuccess: (tokens) => {
      updateTokens(tokens);
    },
    onError: (error: ApiError) => {
      console.error("Token refresh failed:", error.message);
      clearAuth();
    },
  });

  // Helper functions
  const login = async (credentials: LoginData) => {
    setLoading(true);
    try {
      await loginMutation.mutateAsync(credentials);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      await registerMutation.mutateAsync(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setLoading(false);
    }
  };

  const logoutAll = async () => {
    setLoading(true);
    try {
      await logoutAllMutation.mutateAsync();
    } finally {
      setLoading(false);
    }
  };

  const refreshTokens = async () => {
    if (!storedRefreshToken) {
      clearAuth();
      return;
    }

    await refreshMutation.mutateAsync();
  };

  return {
    // State
    user,
    selectedCompany,
    needsCompanySelection,
    isAuthenticated,
    isLoading:
      isLoading || loginMutation.isPending || registerMutation.isPending,

    // Actions
    login,
    register,
    logout,
    logoutAll,
    refreshTokens,
    selectCompany: setSelectedCompany,

    // Mutation states for granular loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Error states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,

    // Utilities
    isTokenExpired,

    // Company management
    availableCompanies: user?.userCompanies || [],
    hasMultipleCompanies: (user?.userCompanies?.length || 0) > 1,
  };
};
