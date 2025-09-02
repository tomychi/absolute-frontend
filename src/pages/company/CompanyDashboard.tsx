import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../auth/auth.hook";
import CompanyLayout from "../../components/company/CompanyLayout";
import Overview from "../../components/company/sections/Overview";
import Products from "../../components/company/sections/Products";
import Users from "../../components/company/sections/Users";
import Settings from "../../components/company/sections/Settings";
import Inventory from "../../components/company/sections/Inventory";
import Branches from "../../components/company/sections/Branches";

const CompanyDashboard = () => {
  const { companyId, section = "overview" } = useParams<{
    companyId: string;
    section?: string;
  }>();
  const navigate = useNavigate();
  const { selectedCompany, user, selectCompany } = useAuth();

  // Verify user has access to this company
  useEffect(() => {
    if (!user || !companyId) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // Check if user belongs to this company
    const userCompany = user.userCompanies.find(
      (company) => company.companyId === companyId,
    );

    if (!userCompany) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // Auto-select company if not selected or different
    if (!selectedCompany || selectedCompany.companyId !== companyId) {
      selectCompany(userCompany);
    }
  }, [companyId, user, selectedCompany, selectCompany, navigate]);

  // Render section based on URL
  const renderSection = () => {
    switch (section) {
      case "branches":
        return <Branches />;
      case "products":
        return <Products />;
      case "inventory":
        return <Inventory />;
      case "users":
        return <Users />;
      case "settings":
        return <Settings />;
      case "overview":
      default:
        return <Overview />;
    }
  };

  if (!selectedCompany || selectedCompany.companyId !== companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <CompanyLayout>{renderSection()}</CompanyLayout>;
};

export default CompanyDashboard;
