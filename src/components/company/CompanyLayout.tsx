import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Package,
  Warehouse,
  Users,
  Settings,
  Building2,
  ChevronDown,
  LogOut,
  MapPin,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "../../auth/auth.hook";
import { useToast } from "../ui/toast";
import Button from "../ui/Button";

const navigation = [
  { name: "Overview", href: "overview", icon: Home },
  { name: "Branches", href: "branches", icon: MapPin },
  { name: "Products", href: "products", icon: Package },
  { name: "Inventory", href: "inventory", icon: Warehouse },
  { name: "Users", href: "users", icon: Users },
  { name: "Settings", href: "settings", icon: Settings },
];

interface CompanyLayoutProps {
  children: React.ReactNode;
}

const CompanyLayout = ({ children }: CompanyLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const { companyId, section = "overview" } = useParams<{
    companyId: string;
    section?: string;
  }>();
  const navigate = useNavigate();
  const { user, selectedCompany, logout, selectCompany } = useAuth();
  const { toast } = useToast();

  const handleNavigation = (href: string) => {
    navigate(`/company/${companyId}/${href}`);
    setSidebarOpen(false);
  };

  const handleCompanySwitch = (
    company: NonNullable<typeof user>["userCompanies"][0],
  ) => {
    selectCompany(company);
    navigate(`/company/${company.companyId}/overview`);
    setCompanyDropdownOpen(false);
    toast.success(`Switched to ${company.roleName} role`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const currentSection =
    navigation.find((item) => item.href === section) || navigation[0];

  if (!selectedCompany || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Company Panel
              </span>
            </div>
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Company selector */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <button
                className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Company {selectedCompany.company.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedCompany.roleName}
                  </p>
                </div>
                <ChevronDown
                  className={clsx(
                    "h-4 w-4 text-gray-400 transition-transform",
                    companyDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {/* Company dropdown */}
              {companyDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {user.userCompanies.map((company) => (
                      <button
                        key={company.id}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleCompanySwitch(company)}
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Company {company.company.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {company.roleName} • Level {company.accessLevelId}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = section === item.href;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={clsx(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="h-4 w-4" />}
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header - solo mobile */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentSection.name}
            </h1>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default CompanyLayout;
