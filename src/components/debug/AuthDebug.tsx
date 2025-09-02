import { useAuth } from "../../auth/auth.hook";

const AuthDebug = () => {
  const {
    user,
    isAuthenticated,
    selectedCompany,
    needsCompanySelection,
    availableCompanies,
    hasMultipleCompanies,
  } = useAuth();

  if (import.meta.env.VITE_NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
      <h4 className="font-bold mb-2">Auth Debug:</h4>
      <div className="space-y-1">
        <p>User: {user ? "✅" : "❌"}</p>
        <p>Authenticated: {isAuthenticated ? "✅" : "❌"}</p>
        <p>Companies: {availableCompanies?.length || 0}</p>
        <p>Multiple: {hasMultipleCompanies ? "✅" : "❌"}</p>
        <p>Needs Selection: {needsCompanySelection ? "✅" : "❌"}</p>
        <p>Selected: {selectedCompany ? "✅" : "❌"}</p>
        {selectedCompany && (
          <p className="text-green-300">Role: {selectedCompany.roleName}</p>
        )}
      </div>
    </div>
  );
};

export default AuthDebug;
