import { useEffect, useState } from "react";
import {
  Package,
  DollarSign,
  Settings,
  Tag,
  Barcode,
  Wand2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../auth/auth.hook";
import { useToast } from "../../ui/toast";
import { useForm } from "../../../hooks/useForm";
import { productApi } from "../../../api/productApi";
import { createProductSchema } from "../../../schemas/product.schemas";
import {
  PRODUCT_TYPES,
  PRODUCT_STATUSES,
  PRODUCT_UNITS,
  type ProductTypeValue,
} from "../../../types/product.types";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProductModal = ({ isOpen, onClose }: CreateProductModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingSku, setIsGeneratingSku] = useState(false);
  const { selectedCompany } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      productApi.createProduct(selectedCompany!.companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const { form, handleSubmit, isSubmitting, submitError } = useForm({
    schema: createProductSchema,
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      price: 0,
      cost: 0,
      type: "physical" as const,
      status: "active" as const,
      unit: "unit" as const,
      isActive: true,
      trackInventory: true,
      allowBackorder: false,
      minStockLevel: undefined,
      maxStockLevel: undefined,
      reorderPoint: undefined,
      reorderQuantity: undefined,
      dimensions: undefined,
      metadata: undefined,
      imageUrl: "",
      barcode: "",
    },
    onSubmit: async (data) => {
      console.log("Datos a enviar:", data); // <- Agregar esta línea
      await createMutation.mutateAsync(data);
    },
  });

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form;
  const trackInventory = watch("trackInventory");
  const productType = watch("type") as ProductTypeValue;

  useEffect(() => {
    if (productType === "digital" || productType === "service") {
      setValue("trackInventory", false);
      setValue("allowBackorder", false);
      setValue("minStockLevel", undefined);
      setValue("maxStockLevel", undefined);
      setValue("reorderPoint", undefined);
      setValue("reorderQuantity", undefined);
      form.clearErrors("trackInventory");
    }
  }, [productType, setValue, form]);

  const generateSku = async () => {
    setIsGeneratingSku(true);
    try {
      // const response = await productApi.generateSku(selectedCompany!.companyId);
      // setValue("sku", response.sku);
      toast.success("SKU generated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate SKU");
    } finally {
      setIsGeneratingSku(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, title: "Basic Info", icon: Package },
    { id: 2, title: "Pricing", icon: DollarSign },
    { id: 3, title: "Inventory", icon: Settings },
    { id: 4, title: "Details", icon: Tag },
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
                label="Product Name"
                placeholder="Premium Wireless Headphones"
                error={errors.name?.message}
                required
                className="text-base py-3"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU *
                </label>
                <div className="flex gap-2">
                  <Input
                    {...register("sku")}
                    placeholder="WH-001"
                    error={errors.sku?.message}
                    required
                    className="flex-1 text-base py-3"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSku}
                    loading={isGeneratingSku}
                    className="px-3 whitespace-nowrap"
                  >
                    <Wand2 className="h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Describe your product features, benefits, specifications..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Type *
                </label>
                <select
                  {...register("type")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {PRODUCT_TYPES.map((type) => (
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit *
                </label>
                <select
                  {...register("unit")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {PRODUCT_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.unit.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  {...register("isActive")}
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Active Product
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  {...register("status")}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {PRODUCT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Pricing Information
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Set your product pricing. Cost should be lower than price for
                profit calculation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Input
                {...register("cost", { valueAsNumber: true })}
                label="Cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                error={errors.cost?.message}
                required
                className="text-base py-3"
                leftIcon={<DollarSign className="h-4 w-4 text-gray-400" />}
              />

              <Input
                {...register("price", { valueAsNumber: true })}
                label="Price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                error={errors.price?.message}
                required
                className="text-base py-3"
                leftIcon={<DollarSign className="h-4 w-4 text-gray-400" />}
              />
            </div>

            {(() => {
              const cost = watch("cost") || 0;
              const price = watch("price") || 0;
              const profit = price - cost;
              const margin =
                price > 0 ? ((profit / price) * 100).toFixed(1) : "0";

              return (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    Profit Analysis
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Profit Amount:
                      </span>
                      <p
                        className={`font-semibold ${profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        ${profit.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Profit Margin:
                      </span>
                      <p
                        className={`font-semibold ${profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {margin}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Status:
                      </span>
                      <p
                        className={`font-semibold ${profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {profit >= 0 ? "Profitable" : "Loss"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  {...register("trackInventory")}
                  type="checkbox"
                  disabled={
                    productType === "digital" || productType === "service"
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-base font-medium text-gray-700 dark:text-gray-300">
                  Track Inventory
                  {(productType === "digital" || productType === "service") && (
                    <span className="text-sm text-gray-500 block">
                      (Not available for {productType} products)
                    </span>
                  )}
                </span>
              </label>

              <label className="flex items-center">
                <input
                  {...register("allowBackorder")}
                  type="checkbox"
                  disabled={
                    productType === "digital" ||
                    productType === "service" ||
                    !trackInventory
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-base font-medium text-gray-700 dark:text-gray-300">
                  Allow Backorders
                </span>
              </label>
            </div>

            {trackInventory &&
              productType !== "digital" &&
              productType !== "service" && (
                <div className="space-y-6 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Stock Management
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      {...register("minStockLevel", { valueAsNumber: true })}
                      label="Minimum Stock Level"
                      type="number"
                      min="0"
                      placeholder="10"
                      error={errors.minStockLevel?.message}
                      className="text-base py-3"
                    />

                    <Input
                      {...register("maxStockLevel", { valueAsNumber: true })}
                      label="Maximum Stock Level"
                      type="number"
                      min="0"
                      placeholder="100"
                      error={errors.maxStockLevel?.message}
                      className="text-base py-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      {...register("reorderPoint", { valueAsNumber: true })}
                      label="Reorder Point"
                      type="number"
                      min="0"
                      placeholder="20"
                      error={errors.reorderPoint?.message}
                      className="text-base py-3"
                    />

                    <Input
                      {...register("reorderQuantity", { valueAsNumber: true })}
                      label="Reorder Quantity"
                      type="number"
                      min="1"
                      placeholder="50"
                      error={errors.reorderQuantity?.message}
                      className="text-base py-3"
                    />
                  </div>
                </div>
              )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <Input
                {...register("imageUrl")}
                label="Image URL"
                type="url"
                placeholder="https://example.com/product-image.jpg"
                error={errors.imageUrl?.message}
                className="text-base py-3"
              />

              <Input
                {...register("barcode")}
                label="Barcode"
                placeholder="1234567890123"
                error={errors.barcode?.message}
                className="text-base py-3"
                leftIcon={<Barcode className="h-4 w-4 text-gray-400" />}
              />
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Product Dimensions (Optional)
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  {...register("dimensions.length")}
                  label="Length"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  error={errors.dimensions?.length?.message}
                  className="text-base py-3"
                />

                <Input
                  {...register("dimensions.width")}
                  label="Width"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  error={errors.dimensions?.width?.message}
                  className="text-base py-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  {...register("dimensions.height")}
                  label="Height"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  error={errors.dimensions?.height?.message}
                  className="text-base py-3"
                />

                <Input
                  {...register("dimensions.weight")}
                  label="Weight"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  error={errors.dimensions?.weight?.message}
                  className="text-base py-3"
                />
              </div>

              <Input
                {...register("dimensions.unit")}
                label="Dimension Unit"
                placeholder="cm"
                error={errors.dimensions?.unit?.message}
                className="text-base py-3"
              />
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Information (Optional)
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  {...register("metadata.brand")}
                  label="Brand"
                  placeholder="Sony"
                  error={errors.metadata?.brand?.message as string}
                  className="text-base py-3"
                />

                <Input
                  {...register("metadata.model")}
                  label="Model"
                  placeholder="WH-1000XM4"
                  error={errors.metadata?.model?.message as string}
                  className="text-base py-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register("metadata.color")}
                  label="Color"
                  placeholder="Black"
                  error={errors.metadata?.color?.message as string}
                  className="text-base py-3"
                />

                <Input
                  {...register("metadata.warranty")}
                  label="Warranty"
                  placeholder="1 year"
                  error={errors.metadata?.warranty?.message as string}
                  className="text-base py-3"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center space-x-4">
            {currentStepData && (
              <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl">
                <currentStepData.icon className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Product
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
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="relative">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                      currentStep >= step.id
                        ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
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
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2" />
                )}
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
                className="px-10 py-3 text-base bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Create Product
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

export default CreateProductModal;
