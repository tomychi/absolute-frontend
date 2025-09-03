import { useState, useMemo } from "react";
import { Search, User, ChevronDown, X } from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "../../../auth/auth.hook";
import type { User as UserType } from "../../../auth/auth.types";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { api } from "../../../lib/api";
import { useQuery } from "@tanstack/react-query";

interface ManagerSelectorProps {
  selectedManagerId?: string;
  onManagerChange: (managerId: string | undefined, manager?: UserType) => void;
  className?: string;
}

const ManagerSelector = ({
  selectedManagerId,
  onManagerChange,
  className,
}: ManagerSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedCompany } = useAuth();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["company-users", selectedCompany?.companyId],
    queryFn: async () => {
      const response = await api.get(
        `/api/user-companies/company/${selectedCompany!.companyId}/members`,
      );
      return response.data.data.members || [];
    },
    enabled: !!selectedCompany && isOpen,
  });

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    return users.filter(
      (user: any) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  // Find selected manager
  const selectedManager = users.find(
    (user: any) => user.id === selectedManagerId,
  );

  const handleSelectManager = (user: any) => {
    onManagerChange(user.id, user);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    onManagerChange(undefined, undefined);
  };

  return (
    <div className={clsx("relative", className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Branch Manager
      </label>

      {/* Selected manager display or trigger button */}
      {selectedManager ? (
        <div className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedManager.fullName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedManager.email}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronDown
                className={clsx(
                  "h-4 w-4 text-gray-500 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <button
              onClick={handleClearSelection}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              Select a manager (optional)
            </span>
          </div>
          <ChevronDown
            className={clsx(
              "h-4 w-4 text-gray-500 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="text-sm"
            />
          </div>

          {/* Users list */}
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Loading users...
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">
                  {searchTerm
                    ? "No users found matching your search"
                    : "No users available"}
                </p>
              </div>
            ) : (
              <div className="py-2">
                {filteredUsers.map((user: any) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectManager(user)}
                    className={clsx(
                      "w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors",
                      selectedManagerId === user.id &&
                        "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500",
                    )}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      {user.userCompanies && user.userCompanies.length > 0 && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {user.userCompanies[0].roleName}
                        </p>
                      )}
                    </div>
                    {selectedManagerId === user.id && (
                      <div className="text-blue-600 dark:text-blue-400">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full text-sm"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSelector;
