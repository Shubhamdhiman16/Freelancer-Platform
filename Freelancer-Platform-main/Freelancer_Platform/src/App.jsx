import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppToaster } from "@/components/ui/sonner";
import DashboardLayout from "@/components/DashboardLayout";
import AddFreelancer from "./pages/AddFreelancer.jsx";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import HireFreelancersDashboard from "./pages/HireFreelancersDashboard";
import Freelancers from "./pages/Freelancers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Debug from "./pages/Debug";

const queryClient = new QueryClient();

// 🔐 Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/auth" replace />;

  return children;
}

// Role-based Dashboard Component
function RoleBasedDashboard() {
  const { role } = useAuth();

  if (role === 'freelancer') {
    return <FreelancerDashboard />;
  } else if (role === 'client') {
    return <HireFreelancersDashboard />;
  } else {
    // Admin or other roles see the original dashboard
    return <Dashboard />;
  }
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/debug" element={<Debug />} />

      {/* ✅ Nested Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleBasedDashboard />} />
        <Route path="freelancers" element={<Freelancers />} />
        <Route path="freelancers/add" element={<AddFreelancer />} />
        <Route path="hire" element={<HireFreelancersDashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<AdminPanel />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <AppToaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
