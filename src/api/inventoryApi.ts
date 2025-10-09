import { api } from "../lib/api";
import type { ApiResponse } from "../auth/auth.types";
import type {
  InventoryResponse,
  InventoryFilters,
  InventoryStats,
  StockAdjustmentRequest,
} from "../types/inventory.types";

export const inventoryApi = {
  // Get inventory for a specific branch
  getBranchInventory: async (
    branchId: string,
    filters?: InventoryFilters & { page?: number; limit?: number },
  ): Promise<InventoryResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.search) params.append("search", filters.search);
    if (filters?.productId) params.append("productId", filters.productId);
    if (filters?.lowStock !== undefined)
      params.append("lowStock", String(filters.lowStock));
    if (filters?.needsRestock !== undefined)
      params.append("needsRestock", String(filters.needsRestock));
    if (filters?.outOfStock !== undefined)
      params.append("outOfStock", String(filters.outOfStock));
    if (filters?.stockStatus) params.append("stockStatus", filters.stockStatus);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get<ApiResponse<InventoryResponse>>(
      `/api/branches/${branchId}/inventory${queryString}`,
    );

    return response.data.data;
  },

  // Adjust stock quantity for a product in a branch
  adjustStock: async (
    branchId: string,
    adjustmentData: StockAdjustmentRequest,
  ): Promise<void> => {
    await api.post(
      `/api/branches/${branchId}/inventory/adjust`,
      adjustmentData,
    );
  },

  // Get inventory statistics for a company
  getInventoryStats: async (companyId: string): Promise<InventoryStats> => {
    const response = await api.get<ApiResponse<InventoryStats>>(
      `/api/companies/${companyId}/inventory/stats`,
    );
    return response.data.data;
  },

  // Get product inventory across all branches
  getProductInventory: async (productId: string) => {
    const response = await api.get<ApiResponse<any>>(
      `/api/products/${productId}/inventory`,
    );
    return response.data.data;
  },

  // Get low stock products for a company
  getLowStockProducts: async (companyId: string) => {
    const response = await api.get<ApiResponse<any>>(
      `/api/companies/${companyId}/inventory/low-stock`,
    );
    return response.data.data;
  },

  // Get products needing restock for a company
  getRestockNeededProducts: async (companyId: string) => {
    const response = await api.get<ApiResponse<any>>(
      `/api/companies/${companyId}/inventory/restock-needed`,
    );
    return response.data.data;
  },

  // Reserve stock for a product in a branch
  reserveStock: async (
    branchId: string,
    productId: string,
    quantity: number,
    reason: string,
  ) => {
    const response = await api.post(
      `/api/branches/${branchId}/inventory/${productId}/reserve`,
      { quantity, reason },
    );
    return response.data;
  },

  // Release reserved stock for a product in a branch
  releaseStock: async (
    branchId: string,
    productId: string,
    quantity: number,
    reason: string,
  ) => {
    const response = await api.post(
      `/api/branches/${branchId}/inventory/${productId}/release`,
      { quantity, reason },
    );
    return response.data;
  },
};
