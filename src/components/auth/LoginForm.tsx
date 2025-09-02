// src/components/auth/LoginForm.tsx
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../auth/auth.hook";
import { loginSchema } from "../../auth/auth.schemas";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../ui/toast";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  showRegisterLink?: boolean;
}

const LoginForm = ({
  onSuccess,
  onRegisterClick,
  showRegisterLink = true,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const { form, handleSubmit, isSubmitting, submitError, clearError } = useForm(
    {
      schema: loginSchema,
      onSubmit: async (data) => {
        await login(data);
        toast.success("Login successful! Welcome back");
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Login error:", error);
        toast.error(error.message, "Login Failed");
      },
    },
  );

  const {
    register,
    formState: { errors },
    watch,
  } = form;

  // Clear error when user starts typing
  const email = watch("email");
  const password = watch("password");

  if (submitError && (email || password)) {
    clearError();
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your credentials
          </p>
        </div>

        {/* General error message */}
        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              {submitError}
            </p>
          </div>
        )}

        {/* Email field */}
        <div>
          <Input
            {...register("email")}
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message}
            leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
            autoComplete="email"
            required
          />
        </div>

        {/* Password field */}
        <div>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          Sign In
        </Button>

        {/* Register link */}
        {showRegisterLink && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onRegisterClick}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
