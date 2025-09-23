import React from 'react';
import { useNotifications } from '../design-system/NotificationSystem';
import { AppShell } from '../admin/components/AppShell';
import { Button, Card } from '../design-system/components';

const NotificationDemoPage: React.FC = () => {
  const { success, error, warning, info, clearAll, notifications } = useNotifications();

  const showSuccessNotification = () => {
    success(
      'Operation Successful',
      'Your changes have been saved successfully.',
      {
        actions: [
          {
            label: 'View Details',
            onClick: () => console.log('View details clicked'),
            variant: 'primary'
          }
        ]
      }
    );
  };

  const showErrorNotification = () => {
    error(
      'Connection Failed',
      'Unable to connect to the server. Please check your internet connection and try again.',
      {
        actions: [
          {
            label: 'Retry',
            onClick: () => console.log('Retry clicked'),
            variant: 'primary'
          },
          {
            label: 'Cancel',
            onClick: () => console.log('Cancel clicked'),
            variant: 'secondary'
          }
        ]
      }
    );
  };

  const showWarningNotification = () => {
    warning(
      'Unsaved Changes',
      'You have unsaved changes that will be lost if you navigate away.',
      {
        duration: 8000,
        actions: [
          {
            label: 'Save Changes',
            onClick: () => console.log('Save changes clicked'),
            variant: 'primary'
          }
        ]
      }
    );
  };

  const showInfoNotification = () => {
    info(
      'New Feature Available',
      'Check out our new dark mode toggle in the top navigation!',
      {
        duration: 6000
      }
    );
  };

  const showPersistentNotification = () => {
    error(
      'Critical System Error',
      'A critical error has occurred that requires immediate attention.',
      {
        persistent: true,
        actions: [
          {
            label: 'Contact Support',
            onClick: () => console.log('Contact support clicked'),
            variant: 'primary'
          }
        ]
      }
    );
  };

  const showQuickSuccess = () => {
    success('Quick Success!', undefined, { duration: 2000 });
  };

  const showMultipleNotifications = () => {
    success('First notification');
    setTimeout(() => warning('Second notification'), 500);
    setTimeout(() => info('Third notification'), 1000);
    setTimeout(() => error('Fourth notification'), 1500);
  };

  return (
    <AppShell>
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Notification System Demo</h1>
          <p className="page-subtitle">
            Test our enterprise-grade notification system with various types and configurations
          </p>
        </div>

        <div className="page-content">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {notifications.length}
              </div>
              <div className="text-sm text-gray-600">Active Notifications</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {notifications.filter(n => n.type === 'success').length}
              </div>
              <div className="text-sm text-gray-600">Success</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-danger-600">
                {notifications.filter(n => n.type === 'error').length}
              </div>
              <div className="text-sm text-gray-600">Errors</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {notifications.filter(n => n.type === 'warning').length}
              </div>
              <div className="text-sm text-gray-600">Warnings</div>
            </Card>
          </div>

          {/* Basic Notifications */}
          <Card className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Basic Notifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={showSuccessNotification}
                variant="primary"
                className="w-full"
              >
                Show Success
              </Button>
              
              <Button 
                onClick={showErrorNotification}
                variant="danger"
                className="w-full"
              >
                Show Error
              </Button>
              
              <Button 
                onClick={showWarningNotification}
                variant="secondary"
                className="w-full"
              >
                Show Warning
              </Button>
              
              <Button 
                onClick={showInfoNotification}
                variant="secondary"
                className="w-full"
              >
                Show Info
              </Button>
            </div>
          </Card>

          {/* Advanced Notifications */}
          <Card className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Advanced Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                onClick={showPersistentNotification}
                variant="ghost"
                className="w-full"
              >
                Persistent Notification
              </Button>
              
              <Button 
                onClick={showQuickSuccess}
                variant="ghost"
                className="w-full"
              >
                Quick Success (2s)
              </Button>
              
              <Button 
                onClick={showMultipleNotifications}
                variant="ghost"
                className="w-full"
              >
                Multiple Notifications
              </Button>
            </div>
          </Card>

          {/* Controls */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Controls</h2>
            <div className="flex gap-4">
              <Button 
                onClick={clearAll}
                variant="ghost"
                disabled={notifications.length === 0}
              >
                Clear All Notifications
              </Button>
              
              <div className="text-sm text-gray-600 flex items-center">
                {notifications.length === 0 
                  ? 'No active notifications' 
                  : `${notifications.length} active notification${notifications.length === 1 ? '' : 's'}`
                }
              </div>
            </div>
          </Card>

          {/* Documentation */}
          <Card className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Notification Types</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Success - Green with checkmark icon</li>
                  <li>• Error - Red with X icon (persistent by default)</li>
                  <li>• Warning - Yellow with triangle icon</li>
                  <li>• Info - Blue with info icon</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Advanced Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Auto-dismiss with progress bar</li>
                  <li>• Persistent notifications</li>
                  <li>• Custom action buttons</li>
                  <li>• Stacking with max limit</li>
                  <li>• Position configuration</li>
                  <li>• Responsive design</li>
                  <li>• Dark theme support</li>
                  <li>• Accessibility compliant</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default NotificationDemoPage;
