import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate("/dashboard", { replace: true });
  };

  const handleLoginClick = () => {
    navigate("/login");
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

        {/* Register form */}
        <RegisterForm
          onSuccess={handleRegisterSuccess}
          onLoginClick={handleLoginClick}
          showLoginLink={true}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
