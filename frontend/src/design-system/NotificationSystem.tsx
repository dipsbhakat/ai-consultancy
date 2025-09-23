import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Button } from './components';

/* ===== NOTIFICATION TYPES ===== */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string, options?: Partial<Notification>) => string;
  error: (title: string, message?: string, options?: Partial<Notification>) => string;
  warning: (title: string, message?: string, options?: Partial<Notification>) => string;
  info: (title: string, message?: string, options?: Partial<Notification>) => string;
}

/* ===== NOTIFICATION CONTEXT ===== */

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

/* ===== NOTIFICATION PROVIDER ===== */

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  defaultDuration = 5000,
  position = 'top-right'
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate unique ID
  const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    const newNotification: Notification = {
      id,
      duration: defaultDuration,
      ...notification
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      
      // Limit maximum notifications
      if (updated.length > maxNotifications) {
        return updated.slice(0, maxNotifications);
      }
      
      return updated;
    });

    // Auto-remove if not persistent
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [defaultDuration, maxNotifications]);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options });
  }, [addNotification]);

  const error = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, persistent: true, ...options });
  }, [addNotification]);

  const warning = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options });
  }, [addNotification]);

  const info = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options });
  }, [addNotification]);

  const value: NotificationContextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} position={position} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

/* ===== NOTIFICATION CONTAINER ===== */

interface NotificationContainerProps {
  notifications: Notification[];
  position: string;
  onRemove: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  position,
  onRemove
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className={`notification-container notification-container-${position}`}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

/* ===== NOTIFICATION ITEM ===== */

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRemove
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Handle removal with animation
  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  return (
    <div 
      className={`
        notification-item 
        notification-item-${notification.type}
        ${isVisible ? 'notification-item-visible' : ''}
        ${isRemoving ? 'notification-item-removing' : ''}
      `}
    >
      <div className="notification-content">
        <div className="notification-icon">
          <NotificationIcon type={notification.type} />
        </div>
        
        <div className="notification-body">
          <div className="notification-title">
            {notification.title}
          </div>
          
          {notification.message && (
            <div className="notification-message">
              {notification.message}
            </div>
          )}
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="notification-actions">
              {notification.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={() => {
                    action.onClick();
                    handleRemove();
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <button
          className="notification-close"
          onClick={handleRemove}
          aria-label="Close notification"
        >
          <CloseIcon />
        </button>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {!notification.persistent && notification.duration && notification.duration > 0 && (
        <div 
          className="notification-progress"
          style={{ 
            animationDuration: `${notification.duration}ms`,
            animationPlayState: isRemoving ? 'paused' : 'running'
          }}
        />
      )}
    </div>
  );
};

/* ===== NOTIFICATION ICONS ===== */

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  const icons = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />
  };
  
  return icons[type];
};

const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c1.5 0 2.9.4 4.1 1"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default NotificationProvider;
