export interface InventoryItem {
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  totalValue: number;
  costPerUnit: number;
  lastUpdated: string;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock" | "needs_restock";
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    cost: number;
    unit: string;
    unitDisplayName: string;
    minStockLevel?: number;
    maxStockLevel?: number;
    reorderPoint?: number;
    imageUrl?: string;
  };
}

export interface InventoryResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StockAdjustmentRequest {
  productId: string;
  newQuantity: number;
  reason: string;
  costPerUnit: number;
}

export interface InventoryStats {
  totalProducts: number;
  totalQuantity: number;
  totalValue: number;
  inStockProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  needsRestockProducts: number;
  byBranch: Record<
    string,
    {
      products: number;
      quantity: number;
      value: number;
    }
  >;
  topProductsByValue: Array<{
    productId: string;
    name: string;
    quantity: number;
    value: number;
  }>;
  recentMovements: {
    todayMovements: number;
    weekMovements: number;
    monthMovements: number;
  };
}

export interface InventoryFilters {
  search?: string;
  productId?: string;
  lowStock?: boolean;
  needsRestock?: boolean;
  outOfStock?: boolean;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock" | "needs_restock";
  sortBy?:
    | "quantity"
    | "availableQuantity"
    | "totalValue"
    | "lastUpdated"
    | "productName";
  sortOrder?: "ASC" | "DESC";
}

export const STOCK_STATUSES = [
  { value: "in_stock", label: "In Stock", color: "green" },
  { value: "low_stock", label: "Low Stock", color: "yellow" },
  { value: "out_of_stock", label: "Out of Stock", color: "red" },
  { value: "needs_restock", label: "Needs Restock", color: "orange" },
] as const;

export const INVENTORY_SORT_OPTIONS = [
  { value: "productName", label: "Product Name" },
  { value: "quantity", label: "Quantity" },
  { value: "availableQuantity", label: "Available Quantity" },
  { value: "totalValue", label: "Total Value" },
  { value: "lastUpdated", label: "Last Updated" },
] as const;
