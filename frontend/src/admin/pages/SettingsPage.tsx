import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Input
} from '../../design-system/components';

import {
  Textarea,
  Select,
  FormGroup,
  FormRow
} from '../../design-system/components/Input';

/* ===== TYPES ===== */
interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultUserRole: string;
  sessionTimeout: number;
  maxFileSize: number;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  backupFrequency: string;
  logRetention: number;
}

interface NotificationSettings {
  emailOnNewContact: boolean;
  emailOnUrgentContact: boolean;
  emailOnSystemError: boolean;
  emailOnUserRegistration: boolean;
  pushOnNewContact: boolean;
  pushOnUrgentContact: boolean;
  pushOnSystemError: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
}

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'integrations'>('general');
  const [isLoading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'AI Consultancy',
    siteDescription: 'Professional AI consulting services',
    contactEmail: 'dipeshbhakat5@gmail.com',
    supportEmail: 'dipeshbhakat5@gmail.com',
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: 'VIEWER',
    sessionTimeout: 30,
    maxFileSize: 10,
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    emailNotifications: true,
    pushNotifications: false,
    backupFrequency: 'daily',
    logRetention: 90,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailOnNewContact: true,
    emailOnUrgentContact: true,
    emailOnSystemError: true,
    emailOnUserRegistration: false,
    pushOnNewContact: false,
    pushOnUrgentContact: true,
    pushOnSystemError: true,
    dailyDigest: true,
    weeklyReport: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // TODO: Load settings from API
        // const data = await adminAPI.getSettings();
        // setSystemSettings(data.system);
        // setNotificationSettings(data.notifications);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save settings to API
      // await adminAPI.updateSettings({ system: systemSettings, notifications: notificationSettings });
      setHasChanges(false);
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleSystemSettingChange = (key: keyof SystemSettings, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleNotificationSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
    { id: 'integrations', label: 'Integrations', icon: BoltIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Configure system settings and preferences
            {isLoading && <span className="ml-2 inline-block"><span className="animate-pulse">●</span> Loading...</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <Badge variant="amber">
              Unsaved Changes
            </Badge>
          )}
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                        ${isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <GeneralSettings
              settings={systemSettings}
              onChange={handleSystemSettingChange}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings
              settings={notificationSettings}
              onChange={handleNotificationSettingChange}
            />
          )}

          {activeTab === 'security' && (
            <SecuritySettings
              settings={systemSettings}
              onChange={handleSystemSettingChange}
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationSettings
              settings={systemSettings}
              onChange={handleSystemSettingChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== SETTINGS COMPONENTS ===== */

interface GeneralSettingsProps {
  settings: SystemSettings;
  onChange: (key: keyof SystemSettings, value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onChange }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Site Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Basic information about your application
        </p>
      </CardHeader>
      <CardContent>
        <FormGroup>
          <Input
            label="Site Name"
            value={settings.siteName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('siteName', e.target.value)}
            placeholder="Enter site name"
          />

          <Textarea
            label="Site Description"
            value={settings.siteDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('siteDescription', e.target.value)}
            placeholder="Enter site description"
            rows={3}
          />

          <FormRow>
            <Input
              label="Contact Email"
              type="email"
              value={settings.contactEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('contactEmail', e.target.value)}
              placeholder="contact@example.com"
            />

            <Input
              label="Support Email"
              type="email"
              value={settings.supportEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('supportEmail', e.target.value)}
              placeholder="support@example.com"
            />
          </FormRow>
        </FormGroup>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          System Configuration
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          General system settings and defaults
        </p>
      </CardHeader>
      <CardContent>
        <FormGroup>
          <FormRow>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('maintenanceMode', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maintenance Mode
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="allowRegistration"
                checked={settings.allowRegistration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('allowRegistration', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="allowRegistration" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Allow User Registration
              </label>
            </div>
          </FormRow>

          <FormRow>
            <Select
              label="Default User Role"
              value={settings.defaultUserRole}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange('defaultUserRole', e.target.value)}
            >
              <option value="VIEWER">Viewer</option>
              <option value="EDITOR">Editor</option>
              <option value="SUPERADMIN">Super Admin</option>
            </Select>

            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => onChange('sessionTimeout', parseInt(e.target.value))}
              min="5"
              max="480"
            />
          </FormRow>

          <FormRow>
            <Input
              label="Max File Size (MB)"
              type="number"
              value={settings.maxFileSize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('maxFileSize', parseInt(e.target.value))}
              min="1"
              max="100"
            />

            <Select
              label="Backup Frequency"
              value={settings.backupFrequency}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange('backupFrequency', e.target.value)}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormRow>

          <Input
            label="Log Retention (days)"
            type="number"
            value={settings.logRetention}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('logRetention', parseInt(e.target.value))}
            min="7"
            max="365"
          />
        </FormGroup>
      </CardContent>
    </Card>
  </div>
);

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onChange: (key: keyof NotificationSettings, value: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onChange }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Email Notifications
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure when to send email notifications
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { key: 'emailOnNewContact', label: 'New contact submissions' },
            { key: 'emailOnUrgentContact', label: 'Urgent contact submissions' },
            { key: 'emailOnSystemError', label: 'System errors and warnings' },
            { key: 'emailOnUserRegistration', label: 'New user registrations' },
            { key: 'dailyDigest', label: 'Daily activity digest' },
            { key: 'weeklyReport', label: 'Weekly summary report' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <input
                type="checkbox"
                checked={settings[key as keyof NotificationSettings] as boolean}
                onChange={(e) => onChange(key as keyof NotificationSettings, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Push Notifications
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure browser push notifications
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { key: 'pushOnNewContact', label: 'New contact submissions' },
            { key: 'pushOnUrgentContact', label: 'Urgent contact submissions' },
            { key: 'pushOnSystemError', label: 'System errors and warnings' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <input
                type="checkbox"
                checked={settings[key as keyof NotificationSettings] as boolean}
                onChange={(e) => onChange(key as keyof NotificationSettings, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

interface SecuritySettingsProps {
  settings: SystemSettings;
  onChange: (key: keyof SystemSettings, value: any) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ settings, onChange }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Session Security
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure session and authentication settings
        </p>
      </CardHeader>
      <CardContent>
        <FormGroup>
          <div className="space-y-1">
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => onChange('sessionTimeout', parseInt(e.target.value))}
              min="5"
              max="480"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              How long before inactive sessions expire
            </p>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Require 2FA for all admin accounts
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Password Policy
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Minimum requirements for user passwords
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Configure
            </Button>
          </div>
        </FormGroup>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Access Control
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage user access and permissions
        </p>
      </CardHeader>
      <CardContent>
        <FormGroup>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="allowRegistration"
              checked={settings.allowRegistration}
              onChange={(e) => onChange('allowRegistration', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="allowRegistration" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Allow new user registrations
            </label>
          </div>

          <div className="space-y-1">
            <Select
              label="Default User Role"
              value={settings.defaultUserRole}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange('defaultUserRole', e.target.value)}
            >
              <option value="VIEWER">Viewer</option>
              <option value="EDITOR">Editor</option>
              <option value="SUPERADMIN">Super Admin</option>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Role assigned to new users
            </p>
          </div>
        </FormGroup>
      </CardContent>
    </Card>
  </div>
);

interface IntegrationSettingsProps {
  settings: SystemSettings;
  onChange: (key: keyof SystemSettings, value: any) => void;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ settings, onChange }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Email Configuration
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure SMTP settings for email notifications
        </p>
      </CardHeader>
      <CardContent>
        <FormGroup>
          <FormRow>
            <Input
              label="SMTP Host"
              value={settings.smtpHost}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('smtpHost', e.target.value)}
              placeholder="smtp.example.com"
            />

            <Input
              label="SMTP Port"
              type="number"
              value={settings.smtpPort}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('smtpPort', parseInt(e.target.value))}
              placeholder="587"
            />
          </FormRow>

          <FormRow>
            <Input
              label="SMTP Username"
              value={settings.smtpUser}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('smtpUser', e.target.value)}
              placeholder="username@example.com"
            />

            <Input
              label="SMTP Password"
              type="password"
              value={settings.smtpPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('smtpPassword', e.target.value)}
              placeholder="Enter password"
            />
          </FormRow>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('emailNotifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable email notifications
            </label>
          </div>
        </FormGroup>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          API Integrations
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Connect with external services and APIs
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { name: 'Google Analytics', status: 'connected', description: 'Track website analytics' },
            { name: 'Slack', status: 'disconnected', description: 'Send notifications to Slack' },
            { name: 'Zapier', status: 'connected', description: 'Automate workflows' },
            { name: 'AWS S3', status: 'connected', description: 'File storage and backup' },
          ].map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {integration.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {integration.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={integration.status === 'connected' ? 'green' : 'neutral'}>
                  {integration.status}
                </Badge>
                <Button variant="secondary" size="sm">
                  {integration.status === 'connected' ? 'Configure' : 'Connect'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ===== ICON COMPONENTS ===== */

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const BoltIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const SaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111 0z" />
  </svg>
);
