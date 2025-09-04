export const PRODUCT_TYPES = [
  { value: "physical", label: "Physical Product" },
  { value: "digital", label: "Digital Product" },
  { value: "service", label: "Service" },
  { value: "subscription", label: "Subscription" },
] as const;

export const PRODUCT_STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "discontinued", label: "Discontinued" },
  { value: "out_of_stock", label: "Out of Stock" },
] as const;

export const PRODUCT_UNITS = [
  { value: "unit", label: "Unit" },
  { value: "kg", label: "Kilogram" },
  { value: "gram", label: "Gram" },
  { value: "liter", label: "Liter" },
  { value: "meter", label: "Meter" },
  { value: "square_meter", label: "Square Meter" },
  { value: "cubic_meter", label: "Cubic Meter" },
  { value: "pack", label: "Pack" },
  { value: "box", label: "Box" },
  { value: "dozen", label: "Dozen" },
] as const;

export type ProductTypeValue = (typeof PRODUCT_TYPES)[number]["value"];
export type ProductStatusValue = (typeof PRODUCT_STATUSES)[number]["value"];
export type ProductUnitValue = (typeof PRODUCT_UNITS)[number]["value"];

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  unit: string;
}

export interface ProductMetadata {
  brand?: string;
  model?: string;
  color?: string;
  warranty?: string;
  tags?: string[];
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  cost: number;
  type: ProductTypeValue;
  typeDisplayName: string;
  status: ProductStatusValue;
  statusDisplayName: string;
  unit: ProductUnitValue;
  unitDisplayName: string;
  isActive: boolean;
  trackInventory: boolean;
  allowBackorder: boolean;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  dimensions?: ProductDimensions;
  metadata?: ProductMetadata;
  imageUrl?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  profitMargin: number;
  profitAmount: number;
  company: {
    id: string;
    name: string;
    displayName: string;
  };
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string;
  price: number;
  cost: number;
  type: ProductTypeValue;
  status: ProductStatusValue;
  unit: ProductUnitValue;
  isActive: boolean;
  trackInventory: boolean;
  allowBackorder: boolean;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  dimensions?: ProductDimensions;
  metadata?: ProductMetadata;
  imageUrl?: string;
  barcode?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductFilters {
  search?: string;
  type?: ProductTypeValue;
  status?: ProductStatusValue;
  unit?: ProductUnitValue;
  isActive?: boolean;
  trackInventory?: boolean;
  minPrice?: number;
  maxPrice?: number;
  lowStock?: boolean;
  needsRestock?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
