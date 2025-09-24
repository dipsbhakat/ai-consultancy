import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AppShell } from '../design-system/components/ModernAppShell';
import {
  AdminLoginPage,
  ContactsPage,
  AdminUsersPage,
  AuditLogsPage,
  SettingsPage
} from './pages';
import { AnalyticsDashboardPage } from './components/analytics/AnalyticsDashboardPage';
import ActivityPage from './pages/ActivityPage';
import NotificationDemoPage from '../pages/NotificationDemoPage';
import DesignSystemShowcasePage from '../pages/DesignSystemShowcasePage';

// Protected Layout Component - creates AppShell once
const ProtectedLayout = () => {
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
  
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
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
      <Route path="login" element={<AdminLoginPage />} />
      
      {/* Protected admin routes - single layout with nested routes */}
      <Route path="*" element={<ProtectedLayout />}>
        <Route path="analytics" element={<AnalyticsDashboardPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="notifications" element={<NotificationDemoPage />} />
        <Route path="design-system" element={<DesignSystemShowcasePage />} />
        
        {/* Role-protected routes */}
        <Route 
          path="users" 
          element={
            <RoleProtectedRoute requiredRoles={['SUPERADMIN']}>
              <AdminUsersPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="audit" 
          element={
            <RoleProtectedRoute requiredRoles={['SUPERADMIN', 'EDITOR']}>
              <AuditLogsPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route index element={<Navigate to="analytics" replace />} />
        
        {/* Legacy dashboard redirect */}
        <Route path="dashboard" element={<Navigate to="analytics" replace />} />
      </Route>
    </Routes>
  );
};
