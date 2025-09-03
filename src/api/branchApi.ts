import { api } from "../lib/api";
import type { ApiResponse } from "../auth/auth.types";
import type {
  Branch,
  CreateBranchRequest,
  UpdateBranchRequest,
  BranchFilters,
  BranchesResponse,
} from "../types/branch.types";

export const branchApi = {
  // Get all branches for a company
  getBranches: async (
    companyId: string,
    filters?: BranchFilters & { page?: number; limit?: number },
  ): Promise<BranchesResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.isActive !== undefined)
      params.append("isActive", String(filters.isActive));
    if (filters?.managerId) params.append("managerId", filters.managerId);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get<ApiResponse<BranchesResponse>>(
      `/api/companies/${companyId}/branches${queryString}`,
    );

    return response.data.data;
  },

  // Get single branch
  getBranch: async (companyId: string, branchId: string): Promise<Branch> => {
    const response = await api.get<ApiResponse<Branch>>(
      `/api/companies/${companyId}/branches/${branchId}`,
    );
    return response.data.data;
  },

  // Create new branch
  createBranch: async (
    companyId: string,
    branchData: CreateBranchRequest,
  ): Promise<Branch> => {
    const response = await api.post<ApiResponse<Branch>>(
      `/api/companies/${companyId}/branches`,
      branchData,
    );
    return response.data.data;
  },

  // Update branch
  updateBranch: async (
    companyId: string,
    branchId: string,
    branchData: UpdateBranchRequest,
  ): Promise<Branch> => {
    const response = await api.put<ApiResponse<Branch>>(
      `/api/companies/${companyId}/branches/${branchId}`,
      branchData,
    );
    return response.data.data;
  },

  // Delete branch
  deleteBranch: async (branchId: string): Promise<void> => {
    await api.delete(`/api/branches/${branchId}`);
  },
  // Toggle branch status
  toggleBranchStatus: async (
    companyId: string,
    branchId: string,
  ): Promise<Branch> => {
    const response = await api.patch<ApiResponse<Branch>>(
      `/api/companies/${companyId}/branches/${branchId}/toggle-status`,
    );
    return response.data.data;
  },
};
