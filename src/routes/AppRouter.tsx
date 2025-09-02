import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "../auth/auth.hook";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import CompanySelectionPage from "../pages/auth/CompanySelectionPage";
import CompanyDashboard from "../pages/company/CompanyDashboard";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, needsCompanySelection, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (needsCompanySelection) {
    return <Navigate to="/select-company" replace />;
  }

  return <>{children}</>;
};

// Company Selection Route (authenticated but needs company selection)
const CompanySelectionRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, needsCompanySelection, selectedCompany, isLoading } =
    useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!needsCompanySelection && selectedCompany) {
    return (
      <Navigate to={`/company/${selectedCompany.companyId}/overview`} replace />
    );
  }

  return <>{children}</>;
};

// Public Route component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, needsCompanySelection, selectedCompany, isLoading } =
    useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (needsCompanySelection) {
      return <Navigate to="/select-company" replace />;
    }
    if (selectedCompany) {
      return (
        <Navigate
          to={`/company/${selectedCompany.companyId}/overview`}
          replace
        />
      );
    }
    return <Navigate to="/select-company" replace />;
  }

  return <>{children}</>;
};
// Component to redirect company root to overview
const CompanyRedirect = () => {
  const { companyId } = useParams<{ companyId: string }>();
  return <Navigate to={`/company/${companyId}/overview`} replace />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Company selection route */}
        <Route
          path="/select-company"
          element={
            <CompanySelectionRoute>
              <CompanySelectionPage />
            </CompanySelectionRoute>
          }
        />

        {/* Company routes - orden importante */}
        <Route
          path="/company/:companyId"
          element={
            <ProtectedRoute>
              <CompanyRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/:companyId/:section"
          element={
            <ProtectedRoute>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/select-company" replace />} />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/select-company" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
