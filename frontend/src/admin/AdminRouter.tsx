import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import {
  AdminLoginPage,
  AdminDashboardPage,
  ContactsPage,
  AdminUsersPage,
  AuditLogsPage
} from './pages';
import { AnalyticsDashboardPage } from './components/analytics/AnalyticsDashboardPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

// Role-based Route Component
const RoleProtectedRoute = ({ 
  children, 
  requiredRoles 
}: { 
  children: React.ReactNode;
  requiredRoles: string[];
}) => {
  const { admin } = useAuth();
  
  if (!admin || !requiredRoles.includes(admin.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export const AdminRouter = () => {
  return (
    <Routes>
      {/* Public admin route */}
      <Route path="/login" element={<AdminLoginPage />} />
      
      {/* Protected admin routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <ContactsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsDashboardPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute requiredRoles={['SUPERADMIN']}>
              <AdminUsersPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/audit"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute requiredRoles={['SUPERADMIN', 'EDITOR']}>
              <AuditLogsPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};
