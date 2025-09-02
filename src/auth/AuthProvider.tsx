import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "./auth.store";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isTokenExpired, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      try {
        // Check if user has valid token
        if (isTokenExpired()) {
          console.log("Token expired or missing, clearing auth state");
          clearAuth();
          return;
        }

        // If token exists and is not expired, user should be authenticated
        console.log("User has valid token, maintaining session");
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isTokenExpired, clearAuth, setLoading]);

  return <>{children}</>;
};
