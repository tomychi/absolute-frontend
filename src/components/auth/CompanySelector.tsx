import { Building2, Users, Crown, Shield, ChevronRight } from "lucide-react";
import { useAuth } from "../../auth/auth.hook";
import { useToast } from "../ui/toast";
import Button from "../ui/Button";
import clsx from "clsx";

interface CompanySelectorProps {
  onCompanySelected?: () => void;
}

const CompanySelector = ({ onCompanySelected }: CompanySelectorProps) => {
  const { user, selectCompany } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user.userCompanies || user.userCompanies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No companies found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Contact your administrator to get access to a company.
          </p>
        </div>
      </div>
    );
  }

  const handleSelectCompany = (company: (typeof user.userCompanies)[0]) => {
    try {
      selectCompany(company);
      toast.success(`Now managing ${company.roleName} role`);

      // Call the callback to handle navigation
      onCompanySelected?.();
    } catch (error) {
      console.error("Failed to select company:", error);
      toast.error("Failed to select company. Please try again.");
    }
  };

  const getRoleIcon = (roleName: string, accessLevel: number) => {
    const role = roleName.toLowerCase();
    if (accessLevel <= 1 || role.includes("owner") || role.includes("admin")) {
      return <Crown className="h-5 w-5 text-yellow-500" />;
    }
    if (accessLevel <= 2 || role.includes("manager")) {
      return <Shield className="h-5 w-5 text-blue-500" />;
    }
    return <Users className="h-5 w-5 text-gray-500" />;
  };

  const getRoleBadgeColor = (roleName: string, accessLevel: number) => {
    const role = roleName.toLowerCase();
    if (accessLevel <= 1 || role.includes("owner") || role.includes("admin")) {
      return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
    }
    if (accessLevel <= 2 || role.includes("manager")) {
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
    }
    return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50">
            <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Choose Your Workspace
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            You have access to {user.userCompanies.length} companies. Select one
            to continue.
          </p>
        </div>

        {/* Company cards */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {user.userCompanies.map((companyUserInclude) => {
            const isActive =
              companyUserInclude.isActive &&
              companyUserInclude.status === "active";

            return (
              <div
                key={companyUserInclude.id}
                className={clsx(
                  "relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200",
                  isActive
                    ? "border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600"
                    : "border-gray-100 dark:border-gray-800 opacity-60",
                )}
              >
                <div className="p-6">
                  {/* Company header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getRoleIcon(
                        companyUserInclude.roleName,
                        companyUserInclude.accessLevelId,
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {companyUserInclude.company.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {companyUserInclude.companyId.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Role and status */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Role
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
                          companyUserInclude.roleName,
                          companyUserInclude.accessLevelId,
                        )}`}
                      >
                        {companyUserInclude.roleName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${
                          companyUserInclude.status === "active"
                            ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                            : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                        }`}
                      >
                        {companyUserInclude.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Access Level
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white font-mono">
                        {companyUserInclude.accessLevel.name}
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-6">
                    <p>
                      Joined:{" "}
                      {new Date(
                        companyUserInclude.joinedAt,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      Last activity:{" "}
                      {new Date(
                        companyUserInclude.lastActivity,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Select button */}
                  <Button
                    onClick={() => handleSelectCompany(companyUserInclude)}
                    variant={isActive ? "primary" : "outline"}
                    size="md"
                    className="w-full"
                    disabled={!isActive}
                    rightIcon={
                      isActive ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : undefined
                    }
                  >
                    {!isActive ? "Company Inactive" : "Enter Workspace"}
                  </Button>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-3 right-3">
                    <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can switch between companies anytime from the dashboard settings
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Having trouble? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanySelector;
