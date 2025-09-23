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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
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
      action: () => navigate('/admin')
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
    <div className="app-shell" data-sidebar-collapsed={sidebarCollapsed}>
      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
      />
      
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdaptiveSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        {/* Top Bar */}
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={isMobile}
        />
        
        {/* Page Content */}
        <main className="app-content">
          <div className="container-custom">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

/* ===== ADAPTIVE SIDEBAR COMPONENT ===== */

interface AdaptiveSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const AdaptiveSidebar: React.FC<AdaptiveSidebarProps> = ({
  collapsed,
  onToggle,
  open,
  onClose,
  isMobile
}) => {
  const { admin } = useAuth();
  const location = useLocation();

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

  const sidebarClasses = [
    'sidebar',
    collapsed && !isMobile ? 'sidebar-collapsed' : 'sidebar-expanded',
    isMobile ? 'sidebar-mobile' : 'sidebar-desktop',
    isMobile && open ? 'sidebar-open' : ''
  ].filter(Boolean).join(' ');

  return (
    <aside className={sidebarClasses}>
      <div className="sidebar-content">
        {/* Logo/Brand */}
        <div className="sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            {(!collapsed || isMobile) && (
              <Text variant="heading-sm" color="primary" className="font-semibold">
                Admin Portal
              </Text>
            )}
          </div>
          
          {!isMobile && (
            <button
              onClick={onToggle}
              className="sidebar-toggle"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {filteredNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  key={`${item.name}-${location.pathname}`}
                  to={item.href}
                  onClick={() => {
                    console.log('Link clicked:', item.href);
                    if (isMobile) onClose();
                  }}
                  className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  style={{ pointerEvents: 'auto', cursor: 'pointer', textDecoration: 'none' }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {(!collapsed || isMobile) && (
                    <Text variant="label-md" className="nav-text">
                      {item.name}
                    </Text>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        {admin && (
          <div className="sidebar-footer">
            <UserProfile admin={admin} collapsed={collapsed && !isMobile} />
          </div>
        )}
      </div>
    </aside>
  );
};

/* ===== TOP BAR COMPONENT ===== */

interface TopBarProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, showMenuButton }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="top-bar">
      <div className="top-bar-content">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="menu-button"
              aria-label="Open sidebar"
            >
              <MenuIcon />
            </button>
          )}
          
          {/* Environment Badge */}
          <Badge variant="blue" size="sm">
            {import.meta.env.MODE === 'production' ? 'Production' : 'Development'}
          </Badge>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle variant="icon" size="md" />
          
          {/* User Info */}
          {admin && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <Text variant="label-sm" color="primary">
                  {admin.firstName} {admin.lastName}
                </Text>
                <Text variant="label-sm" color="secondary">
                  {admin.role}
                </Text>
              </div>
              
              <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center">
                <Text variant="label-sm" color="inverse" className="font-medium">
                  {admin.firstName?.[0]}{admin.lastName?.[0]}
                </Text>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/* ===== USER PROFILE COMPONENT ===== */

interface UserProfileProps {
  admin: any;
  collapsed: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ admin, collapsed }) => {
  const getRoleBadgeVariant = (role: AdminRole) => {
    switch (role) {
      case AdminRole.SUPERADMIN: return 'purple';
      case AdminRole.EDITOR: return 'blue';
      default: return 'neutral';
    }
  };

  return (
    <div className="user-profile">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-purple rounded-full flex items-center justify-center flex-shrink-0">
          <Text variant="label-md" color="inverse" className="font-medium">
            {admin.firstName?.[0]}{admin.lastName?.[0]}
          </Text>
        </div>
        
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <Text variant="label-sm" color="primary" className="truncate">
              {admin.firstName} {admin.lastName}
            </Text>
            <Badge variant={getRoleBadgeVariant(admin.role)} size="sm">
              {admin.role}
            </Badge>
          </div>
        )}
      </div>
    </div>
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

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default AppShell;
