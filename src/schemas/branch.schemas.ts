import { z } from "zod";
import { BRANCH_TYPES, type BranchTypeValue } from "../types/branch.types";

const timeSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)");

const dayHoursSchema = z
  .object({
    open: timeSchema,
    close: timeSchema,
    closed: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.closed) return true;
      const [openHour, openMin] = data.open.split(":").map(Number);
      const [closeHour, closeMin] = data.close.split(":").map(Number);
      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;
      return openMinutes < closeMinutes;
    },
    {
      message: "Opening time must be before closing time",
    },
  );

const businessHoursSchema = z.object({
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
  sunday: dayHoursSchema,
});

const branchTypeValues = BRANCH_TYPES.map((t) => t.value) as [
  BranchTypeValue,
  ...BranchTypeValue[],
];

export const createBranchSchema = z.object({
  name: z
    .string()
    .min(1, "Branch name is required")
    .min(2, "Branch name must be at least 2 characters")
    .max(100, "Branch name must be less than 100 characters"),

  code: z
    .string()
    .min(1, "Branch code is required")
    .min(2, "Branch code must be at least 2 characters")
    .max(20, "Branch code must be less than 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Branch code can only contain uppercase letters, numbers, hyphens, and underscores",
    ),

  type: z
    .enum(branchTypeValues)
    .refine((val) => val !== undefined, { message: "Branch type is required" }),

  address: z
    .string()
    .min(1, "Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(255, "Address must be less than 255 characters"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  managerId: z.string().uuid("Invalid manager ID").optional(),

  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),

  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional(),

  businessHours: businessHoursSchema,

  isActive: z.boolean().default(true),
  isMain: z.boolean().default(false),
});

export const updateBranchSchema = createBranchSchema.partial().extend({
  id: z.string().uuid("Invalid branch ID"),
});

export const branchFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(branchTypeValues).optional(),
  isActive: z.boolean().optional(),
  managerId: z.string().uuid().optional(),
});

// Type inference
export type CreateBranchFormData = z.infer<typeof createBranchSchema>;
export type UpdateBranchFormData = z.infer<typeof updateBranchSchema>;
export type BranchFiltersFormData = z.infer<typeof branchFiltersSchema>;
