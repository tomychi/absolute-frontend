import {
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../../auth/auth.hook";
import clsx from "clsx";

const Overview = () => {
  const { selectedCompany, user } = useAuth();

  // Mock data - aquí conectarías con tu API
  const stats = [
    {
      name: "Total Products",
      value: "2,847",
      change: "+12%",
      changeType: "increase",
      icon: Package,
    },
    {
      name: "Active Users",
      value: "24",
      change: "+2",
      changeType: "increase",
      icon: Users,
    },
    {
      name: "Monthly Revenue",
      value: "$45,231",
      change: "+8.2%",
      changeType: "increase",
      icon: DollarSign,
    },
    {
      name: "System Health",
      value: "99.9%",
      change: "-0.1%",
      changeType: "decrease",
      icon: Activity,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Company Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome to Company {selectedCompany?.companyId.slice(-8)} dashboard
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div
                          className={clsx(
                            "ml-2 flex items-baseline text-sm font-semibold",
                            stat.changeType === "increase"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400",
                          )}
                        >
                          <TrendingUp
                            className={clsx(
                              "self-center flex-shrink-0 h-4 w-4",
                              stat.changeType === "decrease" && "rotate-180",
                            )}
                          />
                          <span className="sr-only">
                            {stat.changeType === "increase"
                              ? "Increased"
                              : "Decreased"}{" "}
                            by
                          </span>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Company info card */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Company Information
          </h3>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Company ID
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                {selectedCompany?.companyId}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Your Role
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {selectedCompany?.roleName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Access Level
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                Level {selectedCompany?.accessLevelId}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Member Since
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {selectedCompany &&
                  new Date(selectedCompany.joinedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <Package className="h-6 w-6 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            Add Product
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create a new product
          </p>
        </button>

        <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <Users className="h-6 w-6 text-green-600 mb-2" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            Invite User
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add team member
          </p>
        </button>

        <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <Calendar className="h-6 w-6 text-purple-600 mb-2" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            Schedule Report
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate analytics
          </p>
        </button>
      </div>
    </div>
  );
};

export default Overview;
