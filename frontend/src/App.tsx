import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './stores/auth';
import { Toaster } from "@/components/ui/sonner";

import { Header } from './components/Header';

import { DashboardPage } from './pages/Dashboard/Dashboard';
import { LoginPage } from './pages/Auth/Login';
import { SignupPage } from './pages/Auth/Signup';
import { ProfilePage } from './pages/Auth/Profile';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { TransactionsPage } from './pages/Transactions/TransactionPage';

function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gray-100 font-inter overflow-y-auto">
      <Toaster position="bottom-right" expand={true} richColors />
      <Header /> 
      
      <main className="mx-auto px-16 py-8 max-w-[1600px]">
        <Outlet /> 
      </main>
    </div>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;