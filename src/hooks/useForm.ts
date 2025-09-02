import { useState } from "react";
import {
  useForm as useReactHookForm,
  type UseFormProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApiError } from "../lib/api";

interface UseFormOptions<T extends z.ZodSchema>
  extends Omit<UseFormProps, "resolver"> {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const useForm = <T extends z.ZodSchema>({
  schema,
  onSubmit,
  onSuccess,
  onError,
  ...formOptions
}: UseFormOptions<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    ...formOptions,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(data);
      onSuccess?.();
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || "An unexpected error occurred";

      setSubmitError(errorMessage);
      onError?.(apiError);

      // Handle field-specific errors if they exist
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            type: "server",
            message: messages[0] || errorMessage,
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  const clearError = () => setSubmitError(null);

  return {
    form,
    handleSubmit,
    isSubmitting,
    submitError,
    clearError,
  };
};
