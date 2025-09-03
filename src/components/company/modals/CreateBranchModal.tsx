import { useState } from "react";
import { X, MapPin, Building2, Clock, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../auth/auth.hook";
import { useToast } from "../../ui/toast";
import { useForm } from "../../../hooks/useForm";
import { branchApi } from "../../../api/branchApi";
import { createBranchSchema } from "../../../schemas/branch.schemas";
import {
  BRANCH_TYPES,
  DEFAULT_BUSINESS_HOURS,
} from "../../../types/branch.types";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import BusinessHoursEditor from "../forms/BusinessHoursEditor";
import ManagerSelector from "../forms/ManagerSelector";

interface CreateBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBranchModal = ({ isOpen, onClose }: CreateBranchModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { selectedCompany } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      branchApi.createBranch(selectedCompany!.companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch created successfully");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create branch");
    },
  });

  const { form, handleSubmit, isSubmitting, submitError } = useForm({
    schema: createBranchSchema,
    defaultValues: {
      name: "",
      code: "",
      type: "retail" as const,
      address: "",
      phone: "",
      email: "",
      businessHours: DEFAULT_BUSINESS_HOURS,
      isActive: true,
      isMain: false,
    },
    onSubmit: async (data) => {
      await createMutation.mutateAsync(data);
    },
  });

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  if (!isOpen) return null;

  const steps = [
    { id: 1, title: "Basic Info", icon: Building2 },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Business Hours", icon: Clock },
    { id: 4, title: "Manager", icon: User },
  ];

  const currentStepData = steps.find((s) => s.id === currentStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register("name")}
                label="Branch Name"
                placeholder="Downtown Store"
                error={errors.name?.message}
                required
                className="text-base py-3"
              />

              <Input
                {...register("code")}
                label="Branch Code"
                placeholder="DT001"
                error={errors.code?.message}
                required
                className="text-base py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Branch Type *
              </label>
              <select
                {...register("type")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {BRANCH_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  {...register("isActive")}
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Active
                </span>
              </label>

              <label className="flex items-center">
                <input
                  {...register("isMain")}
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Main Branch
                </span>
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <Input
              {...register("address")}
              label="Address"
              placeholder="123 Main Street, City, State 12345"
              error={errors.address?.message}
              required
              className="text-base py-3"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register("phone")}
                label="Phone"
                placeholder="+1-555-123-4567"
                error={errors.phone?.message}
                required
                className="text-base py-3"
              />

              <Input
                {...register("email")}
                label="Email"
                type="email"
                placeholder="branch@company.com"
                error={errors.email?.message}
                required
                className="text-base py-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register("latitude", { valueAsNumber: true })}
                label="Latitude"
                type="number"
                step="any"
                placeholder="-34.6037"
                error={errors.latitude?.message}
                className="text-base py-3"
              />

              <Input
                {...register("longitude", { valueAsNumber: true })}
                label="Longitude"
                type="number"
                step="any"
                placeholder="-58.3816"
                error={errors.longitude?.message}
                className="text-base py-3"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <BusinessHoursEditor
            value={watch("businessHours")}
            onChange={(hours) => setValue("businessHours", hours)}
          />
        );

      case 4:
        return (
          <ManagerSelector
            selectedManagerId={watch("managerId")}
            onManagerChange={(managerId, manager) => {
              setValue("managerId", managerId);
              // Opcionalmente guardar info del manager para mostrar
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center space-x-4">
            {currentStepData && (
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                <currentStepData.icon className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Branch
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Step {currentStep} of {steps.length}: {currentStepData?.title}
              </p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className="relative">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                      currentStep >= step.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          className="p-12 overflow-y-auto"
          style={{ maxHeight: "calc(95vh - 200px)" }}
        >
          {submitError && (
            <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <p className="text-base text-red-700 dark:text-red-400 font-medium">
                {submitError}
              </p>
            </div>
          )}

          <div className="space-y-8">{renderStepContent()}</div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-12 py-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            disabled={currentStep === 1 || isSubmitting}
            className="px-8 py-3 text-base"
          >
            Previous
          </Button>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-3 text-base"
            >
              Cancel
            </Button>

            {currentStep === steps.length ? (
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                size="lg"
                className="px-10 py-3 text-base bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Create Branch
              </Button>
            ) : (
              <Button
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length))
                }
                disabled={isSubmitting}
                size="lg"
                className="px-8 py-3 text-base"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBranchModal;
