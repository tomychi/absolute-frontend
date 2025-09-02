import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../auth/auth.hook";
import { registerSchema } from "../../auth/auth.schemas";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../ui/toast";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
  showLoginLink?: boolean;
}

const RegisterForm = ({
  onSuccess,
  onLoginClick,
  showLoginLink = true,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const { toast } = useToast();

  const { form, handleSubmit, isSubmitting, submitError, clearError } = useForm(
    {
      schema: registerSchema,
      onSubmit: async (data) => {
        await registerUser(data);
        toast.success("Account created successfully! Welcome aboard");
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Registration error:", error);
        toast.error(error.message, "Registration Failed");
      },
    },
  );

  const {
    register,
    formState: { errors },
    watch,
  } = form;

  // Clear error when user starts typing
  const watchedFields = watch([
    "email",
    "password",
    "firstName",
    "lastName",
    "phone",
  ]);

  if (submitError && watchedFields.some((field) => field)) {
    clearError();
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Get started with your free account today
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

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register("firstName")}
            type="text"
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            leftIcon={<User className="h-4 w-4 text-gray-400" />}
            autoComplete="given-name"
            required
          />

          <Input
            {...register("lastName")}
            type="text"
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            leftIcon={<User className="h-4 w-4 text-gray-400" />}
            autoComplete="family-name"
            required
          />
        </div>

        {/* Email field */}
        <Input
          {...register("email")}
          type="email"
          label="Email"
          placeholder="john.doe@example.com"
          error={errors.email?.message}
          leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
          autoComplete="email"
          required
        />

        {/* Phone field */}
        <Input
          {...register("phone")}
          type="tel"
          label="Phone"
          placeholder="+1234567890"
          error={errors.phone?.message}
          leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
          autoComplete="tel"
          required
        />

        {/* Password field */}
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            autoComplete="new-password"
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

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          Create Account
        </Button>

        {/* Login link */}
        {showLoginLink && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
