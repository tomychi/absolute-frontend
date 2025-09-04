import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Package,
  Edit,
  Trash2,
  MoreHorizontal,
  TrendingUp,
  Eye,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "../../../auth/auth.hook";
import { useToast } from "../../ui/toast";
import { productApi } from "../../../api/productApi";
import {
  PRODUCT_TYPES,
  PRODUCT_STATUSES,
  PRODUCT_UNITS,
} from "../../../types/product.types";
import type {
  Product,
  ProductFilters,
  ProductTypeValue,
  ProductStatusValue,
} from "../../../types/product.types";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const Products = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  const { selectedCompany } = useAuth();
  const { toast } = useToast();

  // Get products query
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "products",
      selectedCompany?.companyId,
      { ...filters, search: searchFilter },
      currentPage,
    ],
    queryFn: () =>
      productApi.getProducts(selectedCompany!.companyId, {
        ...filters,
        search: searchFilter || undefined,
        page: currentPage,
        limit: pageSize,
      }),
    enabled: !!selectedCompany,
  });

  const products = productsResponse?.products || [];
  const totalProducts = productsResponse?.total || 0;
  const totalPages = productsResponse?.totalPages || 1;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchFilter(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleTypeFilter = (type: string) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      type: type === "all" ? undefined : (type as ProductTypeValue),
    }));
  };

  const handleStatusFilter = (status: string) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : (status as ProductStatusValue),
    }));
  };

  const getStatusColor = (status: ProductStatusValue) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "discontinued":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "out_of_stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleClearAll = () => {
    setFilters({});
    setSearchTerm("");
    setSearchFilter("");
    setCurrentPage(1);
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
            Failed to load products. Please try again.
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
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your company's product catalog
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Type filter */}
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={filters.type || "all"}
              onChange={(e) => handleTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {PRODUCT_TYPES.map((type) => (
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
              value={filters.status || "all"}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {PRODUCT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active filters */}
      {(searchFilter || filters.type || filters.status) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Active filters:
          </span>
          {searchFilter && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Search: "{searchFilter}"
            </span>
          )}
          {filters.type && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Type: {PRODUCT_TYPES.find((t) => t.value === filters.type)?.label}
            </span>
          )}
          {filters.status && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Status:{" "}
              {PRODUCT_STATUSES.find((s) => s.value === filters.status)?.label}
            </span>
          )}
          <button
            onClick={handleClearAll}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {searchFilter || filters.type || filters.status
              ? "No products match your filters"
              : "No products found"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchFilter || filters.type || filters.status
              ? "Try adjusting your search criteria or clear filters."
              : "Get started by creating your first product."}
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            {(searchFilter || filters.type || filters.status) && (
              <Button variant="outline" onClick={handleClearAll}>
                Clear Filters
              </Button>
            )}
            <Button
              onClick={() => setShowCreateModal(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Product
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Product image */}
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                {/* Product info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {product.sku}
                      </p>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.description || "No description"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${product.price}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Cost: ${product.cost}
                      </p>
                    </div>
                    <span
                      className={clsx(
                        "px-2 py-1 text-xs font-semibold rounded-full",
                        getStatusColor(product.status),
                      )}
                    >
                      {product.statusDisplayName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{product.typeDisplayName}</span>
                    {product.profitMargin && (
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {product.profitMargin.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="h-3 w-3" />}
                    className="flex-1"
                    onClick={() => {
                      setSelectedProduct(product);
                      // TODO: Abrir modal de vista/edición
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit className="h-3 w-3" />}
                    className="flex-1"
                    onClick={() => {
                      setSelectedProduct(product);
                      // TODO: Abrir modal de edición
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Trash2 className="h-3 w-3" />}
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowDeleteModal(true);
                    }}
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
              {totalProducts}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Products
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">
              {products.filter((p) => p.status === "active").length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">
              {products.filter((p) => p.status === "out_of_stock").length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Out of Stock
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-purple-600">
              {products.filter((p) => p.trackInventory).length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track Inventory
            </p>
          </div>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalProducts)} of{" "}
              {totalProducts} products
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

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Product</h2>
            <p>Modal de creación de productos próximamente...</p>
            <Button onClick={() => setShowCreateModal(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Delete Modal Placeholder */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Product</h2>
            <p>¿Seguro que quieres eliminar "{selectedProduct?.name}"?</p>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  toast.info("Delete functionality coming soon");
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
