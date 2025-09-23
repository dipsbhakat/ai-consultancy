import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminRole } from '../types';
import { Button, Badge, Text } from '../../design-system/components';
import { CommandPalette } from '../../design-system/CommandPalette';
import { ThemeToggle } from '../../design-system/ThemeProvider';

/* ===== APP SHELL COMPONENT ===== */

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Command palette commands
  const commands = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      description: 'Navigate to the admin dashboard',
      category: 'Navigation',
      keywords: ['dashboard', 'home', 'overview'],
      action: () => navigate('/admin/dashboard')
    },
    {
      id: 'contacts',
      title: 'View Contacts',
      description: 'Manage contact submissions',
      category: 'Navigation',
      keywords: ['contacts', 'leads', 'submissions'],
      action: () => navigate('/admin/contacts')
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure admin settings',
      category: 'Navigation',
      keywords: ['settings', 'config', 'preferences'],
      action: () => navigate('/admin/settings')
    },
    {
      id: 'logout',
      title: 'Logout',
      description: 'Sign out of admin dashboard',
      category: 'Actions',
      keywords: ['logout', 'signout', 'exit'],
      action: () => navigate('/admin/logout')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
      />
      
      {/* Top Navigation Bar */}
      <TopNavigationBar />
      
      {/* Main Content Area */}
      <main className="pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

/* ===== TOP NAVIGATION BAR COMPONENT ===== */

const TopNavigationBar: React.FC = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: <DashboardIcon />, 
      roles: ['SUPERADMIN', 'EDITOR', 'VIEWER'] 
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: <AnalyticsIcon />, 
      roles: ['SUPERADMIN', 'EDITOR', 'VIEWER'] 
    },
    { 
      name: 'Contacts', 
      href: '/admin/contacts', 
      icon: <ContactsIcon />, 
      roles: ['SUPERADMIN', 'EDITOR', 'VIEWER'] 
    },
    { 
      name: 'Activity', 
      href: '/admin/activity', 
      icon: <ActivityIcon />, 
      roles: ['SUPERADMIN', 'EDITOR', 'VIEWER'] 
    },
    { 
      name: 'Notifications', 
      href: '/admin/notifications', 
      icon: <BellIcon />, 
      roles: ['SUPERADMIN', 'EDITOR', 'VIEWER'] 
    },
    { 
      name: 'Design System', 
      href: '/admin/design-system', 
      icon: <DesignIcon />, 
      roles: ['SUPERADMIN', 'EDITOR', 'VIEWER'] 
    },
    { 
      name: 'Admin Users', 
      href: '/admin/users', 
      icon: <UsersIcon />, 
      roles: ['SUPERADMIN'] 
    },
    { 
      name: 'Audit Logs', 
      href: '/admin/audit', 
      icon: <AuditIcon />, 
      roles: ['SUPERADMIN', 'EDITOR'] 
    },
  ];

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(admin?.role || '')
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <Text variant="heading-sm" color="primary" className="font-semibold">
                Admin Portal
              </Text>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => console.log('Navigating to:', item.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-accent-blue text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="w-4 h-4">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {/* Environment Badge */}
            <Badge variant="blue" size="sm">
              {import.meta.env.MODE === 'production' ? 'Production' : 'Development'}
            </Badge>

            {/* Theme Toggle */}
            <ThemeToggle variant="icon" size="md" />

            {/* User Info */}
            {admin && (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <Text variant="label-sm" weight="medium" color="primary">
                    {admin.firstName} {admin.lastName}
                  </Text>
                  <Badge 
                    variant={admin.role === AdminRole.SUPERADMIN ? 'purple' : admin.role === AdminRole.EDITOR ? 'blue' : 'neutral'} 
                    size="sm"
                  >
                    {admin.role}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 pt-2 pb-2">
          <nav className="flex space-x-1 overflow-x-auto">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => console.log('Mobile navigating to:', item.href)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(item.href)
                    ? 'bg-accent-blue text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="w-4 h-4">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};



/* ===== ICON COMPONENTS ===== */

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const ContactsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m22 21-3-3"/>
  </svg>
);

const ActivityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const DesignIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const AuditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

export default AppShell;
