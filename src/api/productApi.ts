import { api } from "../lib/api";
import type { ApiResponse } from "../auth/auth.types";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  ProductsResponse,
  ProductStatusValue,
} from "../types/product.types";

export const productApi = {
  // Get all products for a company
  getProducts: async (
    companyId: string,
    filters?: ProductFilters & { page?: number; limit?: number },
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.unit) params.append("unit", filters.unit);
    if (filters?.isActive !== undefined)
      params.append("isActive", String(filters.isActive));
    if (filters?.trackInventory !== undefined)
      params.append("trackInventory", String(filters.trackInventory));
    if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
    if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));
    if (filters?.lowStock !== undefined)
      params.append("lowStock", String(filters.lowStock));
    if (filters?.needsRestock !== undefined)
      params.append("needsRestock", String(filters.needsRestock));
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get<ApiResponse<ProductsResponse>>(
      `/api/companies/${companyId}/products${queryString}`,
    );

    return response.data.data;
  },

  // Get single product
  getProduct: async (productId: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(
      `/api/products/${productId}`,
    );
    return response.data.data;
  },

  // Create new product
  createProduct: async (
    companyId: string,
    productData: CreateProductRequest,
  ): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>(
      `/api/companies/${companyId}/products`,
      productData,
    );
    return response.data.data;
  },

  // Update product
  updateProduct: async (
    productId: string,
    productData: UpdateProductRequest,
  ): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(
      `/api/products/${productId}`,
      productData,
    );
    return response.data.data;
  },

  // Delete product
  deleteProduct: async (productId: string): Promise<void> => {
    await api.delete(`/api/products/${productId}`);
  },

  // Toggle product status
  toggleProductStatus: async (productId: string): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(
      `/api/products/${productId}/toggle-status`,
    );
    return response.data.data;
  },

  // Update product status
  updateProductStatus: async (
    productId: string,
    status: ProductStatusValue,
  ): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(
      `/api/products/${productId}/status/${status}`,
    );
    return response.data.data;
  },

  // Generate SKU suggestion
  generateSku: async (companyId: string): Promise<{ sku: string }> => {
    const response = await api.get<ApiResponse<{ sku: string }>>(
      `/api/companies/${companyId}/products/generate-sku`,
    );
    return response.data.data;
  },

  // Find product by barcode
  findByBarcode: async (
    companyId: string,
    barcode: string,
  ): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(
      `/api/companies/${companyId}/products/barcode/${barcode}`,
    );
    return response.data.data;
  },

  // Get product summaries
  getProductSummaries: async (companyId: string): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(
      `/api/companies/${companyId}/products/summaries`,
    );
    return response.data.data;
  },

  // Get product statistics
  getProductStats: async (companyId: string): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(
      `/api/companies/${companyId}/products/stats`,
    );
    return response.data.data;
  },

  // Bulk upload products
  bulkUploadProducts: async (companyId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ApiResponse<any>>(
      `/api/companies/${companyId}/products/bulk-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  },
};
