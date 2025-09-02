import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/dashboard", { replace: true });
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* App branding */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {import.meta.env.VITE_APP_NAME || "Absolute Frontend"}
          </h1>
        </div>

        {/* Login form */}
        <LoginForm
          onSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
          showRegisterLink={true}
        />
      </div>
    </div>
  );
};

export default LoginPage;
