import { useNavigate } from "react-router-dom";
import CompanySelector from "../../components/auth/CompanySelector";
import { useAuth } from "../../auth/auth.hook";

const CompanySelectionPage = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useAuth();

  const handleCompanySelected = () => {
    // Use the selected company from the auth store
    if (selectedCompany) {
      navigate(`/company/${selectedCompany.companyId}/overview`, {
        replace: true,
      });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return <CompanySelector onCompanySelected={handleCompanySelected} />;
};

export default CompanySelectionPage;
