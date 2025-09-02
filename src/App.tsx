import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./auth/AuthProvider";
import { ToastContainer } from "./components/ui/toast";
import AuthDebug from "./components/debug/AuthDebug";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <ToastContainer />
      <AuthDebug />
    </AuthProvider>
  );
}

export default App;
