// src/components/company/sections/Branches.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Clock,
  Edit,
  Trash2,
  MoreHorizontal,
  Building2,
} from "lucide-react";
import { useAuth } from "../../../auth/auth.hook";
import { useToast } from "../../ui/toast";
import { branchApi } from "../../../api/branchApi";
import type {
  Branch,
  BranchFilters,
  BranchTypeValue,
} from "../../../types/branch.types";
import { BRANCH_TYPES } from "../../../types/branch.types";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { clsx } from "clsx";

const Branches = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filters, setFilters] = useState<BranchFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  // Agregar estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const { selectedCompany } = useAuth();
  const { toast } = useToast();

  // Get branches query
  const {
    data: branchesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["branches", selectedCompany?.companyId, filters, currentPage],
    queryFn: () =>
      branchApi.getBranches(selectedCompany!.companyId, {
        ...filters,
        page: currentPage,
        limit: pageSize,
      }),
    enabled: !!selectedCompany,
  });

  const branches = branchesResponse?.branches || [];
  const totalBranches = branchesResponse?.total || 0;
  const totalPages = branchesResponse?.totalPages || 1;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value || undefined }));
  };

  const handleTypeFilter = (type: string) => {
    setCurrentPage(1); // AGREGAR ESTO
    setFilters((prev) => ({
      ...prev,
      type: type === "all" ? undefined : (type as BranchTypeValue),
    }));
  };

  const handleStatusFilter = (status: string) => {
    setCurrentPage(1);

    setFilters((prev) => ({
      ...prev,
      isActive: status === "all" ? undefined : status === "active",
    }));
  };

  const getBranchTypeLabel = (type: string) => {
    const branchType = BRANCH_TYPES.find((t) => t.value === type);
    return branchType?.label || type;
  };

  const formatBusinessHours = (branch: Branch) => {
    if (!branch.businessHours) return "Not set";

    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const todayHours =
      branch.businessHours[today as keyof typeof branch.businessHours];

    if (todayHours?.closed) return "Closed today";

    return `${todayHours?.open} - ${todayHours?.close}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">
            Failed to load branches. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Branches
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your company locations and branches
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Branch
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <Input
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Type filter */}
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={filters.type || "all"} // AGREGAR ESTO
              onChange={(e) => handleTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {BRANCH_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={
                filters.isActive === undefined
                  ? "all"
                  : filters.isActive === true
                    ? "active"
                    : "inactive"
              }
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {(filters.search || filters.type || filters.isActive !== undefined) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Active filters:
          </span>
          {filters.search && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Search: "{filters.search}"
            </span>
          )}
          {filters.type && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Type: {BRANCH_TYPES.find((t) => t.value === filters.type)?.label}
            </span>
          )}
          {filters.isActive !== undefined && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Status: {filters.isActive ? "Active" : "Inactive"}
            </span>
          )}
          <button
            onClick={() => {
              setFilters({});
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Branches Grid */}
      {branches.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {/* Mensaje dinámico basado en filtros */}
            {filters.search || filters.type || filters.isActive !== undefined
              ? "No branches match your filters"
              : "No branches found"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filters.search || filters.type || filters.isActive !== undefined
              ? "Try adjusting your search criteria or clear filters."
              : "Get started by creating your first branch."}
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            {(filters.search ||
              filters.type ||
              filters.isActive !== undefined) && (
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            )}
            <Button
              onClick={() => setShowCreateModal(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Branch
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {branch.name}
                      </h3>
                      {branch.isMain && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Main
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {branch.code}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getBranchTypeLabel(branch.type)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={clsx(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        branch.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                      )}
                    >
                      {branch.isActive ? "Active" : "Inactive"}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{branch.address}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{branch.phone}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{branch.email}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{formatBusinessHours(branch)}</span>
                  </div>

                  {branch.manager && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Manager
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {branch.manager.fullName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBranch(branch);
                      setShowEditModal(true);
                    }}
                    leftIcon={<Edit className="h-3 w-3" />}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Handle delete
                      toast.info("Delete functionality coming soon");
                    }}
                    leftIcon={<Trash2 className="h-3 w-3" />}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {totalBranches}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Branches
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">
              {branches.filter((b) => b.isActive).length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">
              {branches.filter((b) => b.isCurrentlyOpen).length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Currently Open
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-purple-600">
              {branches.filter((b) => b.isMain).length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Main Branches
            </p>
          </div>
        </div>
      </div>

      {/* Modals - TODO: Create components */}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalBranches)} of{" "}
              {totalBranches} branches
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create Branch Modal</h2>
            <p>Modal component coming next...</p>
            <Button onClick={() => setShowCreateModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
