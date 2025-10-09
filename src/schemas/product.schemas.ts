// src/schemas/product.schemas.ts
import { z } from "zod";
import {
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  PRODUCT_UNITS,
  type ProductStatusValue,
  type ProductTypeValue,
  type ProductUnitValue,
} from "../types/product.types";

const dimensionsSchema = z
  .object({
    length: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().positive().optional(),
    ),
    width: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().positive().optional(),
    ),
    height: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().positive().optional(),
    ),
    weight: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().positive().optional(),
    ),
    unit: z.string().optional(),
  })
  .optional()
  .nullable();

const metadataSchema = z
  .object({
    brand: z.string().optional(),
    model: z.string().optional(),
    color: z.string().optional(),
    warranty: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
  .catchall(z.any())
  .optional();

const productTypeValues = PRODUCT_TYPES.map((t) => t.value) as [
  ProductTypeValue,
  ...ProductTypeValue[],
];

const productStatusValues = PRODUCT_STATUSES.map((s) => s.value) as [
  ProductStatusValue,
  ...ProductStatusValue[],
];

const productUnitValues = PRODUCT_UNITS.map((u) => u.value) as [
  ProductUnitValue,
  ...ProductUnitValue[],
];

export const createProductSchema = z
  .object({
    name: z
      .string()
      .min(1, "Product name is required")
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name must be less than 100 characters"),

    sku: z
      .string()
      .min(1, "SKU is required")
      .min(2, "SKU must be at least 2 characters")
      .max(50, "SKU must be less than 50 characters")
      .regex(
        /^[A-Z0-9_-]+$/,
        "SKU must contain only uppercase letters, numbers, hyphens, and underscores",
      ),

    description: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .optional(),

    price: z
      .number()
      .positive("Price must be positive")
      .max(999999.99, "Price is too high"),

    cost: z
      .number()
      .positive("Cost must be positive")
      .max(999999.99, "Cost is too high"),

    type: z.enum(productTypeValues).refine((val) => val !== undefined, {
      message: "Product type is required",
    }),

    status: z.enum(productStatusValues).refine((val) => val !== undefined, {
      message: "Product status is required",
    }),

    unit: z.enum(productUnitValues).refine((val) => val !== undefined, {
      message: "Product unit is required",
    }),

    isActive: z.boolean().default(true),
    trackInventory: z.boolean().default(true),
    allowBackorder: z.boolean().default(false),

    minStockLevel: z
      .number()
      .int("Minimum stock level must be an integer")
      .min(0, "Minimum stock level cannot be negative")
      .optional(),

    maxStockLevel: z
      .number()
      .int("Maximum stock level must be an integer")
      .min(0, "Maximum stock level cannot be negative")
      .optional(),

    reorderPoint: z
      .number()
      .int("Reorder point must be an integer")
      .min(0, "Reorder point cannot be negative")
      .optional(),

    reorderQuantity: z
      .number()
      .int("Reorder quantity must be an integer")
      .min(1, "Reorder quantity must be at least 1")
      .optional(),

    dimensions: dimensionsSchema,
    metadata: metadataSchema,

    imageUrl: z
      .string()
      .url("Please enter a valid image URL")
      .optional()
      .or(z.literal("")),

    barcode: z
      .string()
      .regex(/^[0-9]{8,13}$/, "Barcode must be 8-13 digits")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // Digital products and services cannot have inventory tracking
      if (
        (data.type === "digital" || data.type === "service") &&
        data.trackInventory
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Digital products and services cannot have inventory tracking enabled",
      path: ["trackInventory"],
    },
  )
  .refine(
    (data) => {
      // Validate cost is less than price
      return data.cost < data.price;
    },
    {
      message: "Cost must be less than price",
      path: ["cost"],
    },
  )
  .refine(
    (data) => {
      // Validate min stock <= max stock if both are provided
      if (
        data.minStockLevel !== undefined &&
        data.maxStockLevel !== undefined
      ) {
        return data.minStockLevel <= data.maxStockLevel;
      }
      return true;
    },
    {
      message:
        "Minimum stock level must be less than or equal to maximum stock level",
      path: ["minStockLevel"],
    },
  )
  .refine(
    (data) => {
      // Validate reorder point is between min and max if all are provided
      if (
        data.reorderPoint !== undefined &&
        data.minStockLevel !== undefined &&
        data.maxStockLevel !== undefined
      ) {
        return (
          data.reorderPoint >= data.minStockLevel &&
          data.reorderPoint <= data.maxStockLevel
        );
      }
      return true;
    },
    {
      message: "Reorder point must be between minimum and maximum stock levels",
      path: ["reorderPoint"],
    },
  );

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid("Invalid product ID"),
});

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["physical", "digital", "service", "subscription"]).optional(),
  status: z
    .enum(["active", "inactive", "discontinued", "out_of_stock"])
    .optional(),
  unit: z
    .enum([
      "unit",
      "kg",
      "gram",
      "liter",
      "meter",
      "square_meter",
      "cubic_meter",
      "pack",
      "box",
      "dozen",
    ])
    .optional(),
  isActive: z.boolean().optional(),
  trackInventory: z.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  lowStock: z.boolean().optional(),
  needsRestock: z.boolean().optional(),
  sortBy: z
    .enum([
      "name",
      "sku",
      "price",
      "cost",
      "type",
      "status",
      "createdAt",
      "updatedAt",
    ])
    .optional(),
  sortOrder: z.enum(["ASC", "DESC"]).optional(),
});

// Type inference
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type ProductFiltersFormData = z.infer<typeof productFiltersSchema>;
