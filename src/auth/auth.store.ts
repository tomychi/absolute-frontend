import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthTokens, AuthResponse } from "./auth.types";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedCompany: User["userCompanies"][0] | null;
  needsCompanySelection: boolean;

  // Actions
  setAuth: (authData: AuthResponse) => void;
  updateTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedCompany: (company: User["userCompanies"][0]) => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      selectedCompany: null,
      needsCompanySelection: false,

      // Actions
      setAuth: (authData: AuthResponse) => {
        const hasMultipleCompanies = authData.user.userCompanies.length > 1;
        const defaultCompany =
          authData.user.userCompanies.length === 1
            ? authData.user.userCompanies[0]
            : null;

        set({
          user: authData.user,
          accessToken: authData.tokens.accessToken,
          refreshToken: authData.tokens.refreshToken,
          expiresAt: authData.tokens.expiresAt,
          isAuthenticated: true,
          isLoading: false,
          selectedCompany: defaultCompany,
          needsCompanySelection: hasMultipleCompanies,
        });
      },

      updateTokens: (tokens: AuthTokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
        });
      },

      setSelectedCompany: (company: User["userCompanies"][0]) => {
        set({
          selectedCompany: company,
          needsCompanySelection: false,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          isLoading: false,
          selectedCompany: null,
          needsCompanySelection: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;

        const now = new Date().getTime();
        const expiration = new Date(expiresAt).getTime();

        // Consider token expired if it expires in the next 5 minutes
        const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds

        return now >= expiration - bufferTime;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        selectedCompany: state.selectedCompany,
        needsCompanySelection: state.needsCompanySelection,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
