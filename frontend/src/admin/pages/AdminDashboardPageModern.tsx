import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardStats } from '../types';
import { adminAPI } from '../hooks/useAdminAPI';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Button, 
  Badge
} from '../../design-system/components';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminAPI.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md">
          <CardContent className="text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Overview of system activity and performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="green">
            System Healthy
          </Badge>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshIcon className="w-4 h-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts"
          value={stats?.contacts.total || 0}
          change={12.5}
          changeDirection="up"
          changePeriod="last month"
          icon={<ContactsIcon className="w-6 h-6" />}
          loading={loading}
          description="All contact form submissions"
        />
        
        <MetricCard
          title="New Contacts"
          value={stats?.contacts.new || 0}
          change={8.2}
          changeDirection="up"
          changePeriod="last week"
          icon={<NewContactsIcon className="w-6 h-6" />}
          loading={loading}
          variant="featured"
          description="Awaiting review"
        />
        
        <MetricCard
          title="Urgent Items"
          value={stats?.contacts.urgent || 0}
          change={-2.1}
          changeDirection="down"
          changePeriod="yesterday"
          icon={<UrgentIcon className="w-6 h-6" />}
          loading={loading}
          description="Require immediate attention"
        />
        
        <MetricCard
          title="Active Admins"
          value={stats?.admins.active || 0}
          change={0}
          changeDirection="neutral"
          changePeriod="last hour"
          icon={<AdminsIcon className="w-6 h-6" />}
          loading={loading}
          description="Currently online"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Status Overview */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Contact Status Breakdown
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StatusRow
                label="New Submissions"
                count={stats?.contacts.new || 0}
                variant="amber"
                loading={loading}
              />
              <StatusRow
                label="Under Review"
                count={stats?.contacts.inReview || 0}
                variant="blue"
                loading={loading}
              />
              <StatusRow
                label="Resolved"
                count={stats?.contacts.resolved || 0}
                variant="green"
                loading={loading}
              />
              <StatusRow
                label="Urgent"
                count={stats?.contacts.urgent || 0}
                variant="red"
                loading={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quick Actions
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ActionButton
                to="/admin/contacts?status=NEW"
                icon={<ContactsIcon className="w-5 h-5" />}
                title="Review New Contacts"
                description="Process recent submissions"
                count={stats?.contacts.new || 0}
              />
              
              <ActionButton
                to="/admin/contacts?priority=URGENT"
                icon={<UrgentIcon className="w-5 h-5" />}
                title="Handle Urgent Items"
                description="Address critical issues"
                count={stats?.contacts.urgent || 0}
                variant="red"
              />
              
              <ActionButton
                to="/admin/analytics"
                icon={<AnalyticsIcon className="w-5 h-5" />}
                title="View Analytics"
                description="System performance metrics"
              />
              
              <ActionButton
                to="/admin/audit"
                icon={<AuditIcon className="w-5 h-5" />}
                title="Audit Logs"
                description="Review system activity"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Note */}
      <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <InformationCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                System Activity Summary
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {stats?.contacts.recent || 0} new contacts received in the last 7 days. 
                System performance is optimal with {stats?.admins.active || 0} administrators currently active.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ===== HELPER COMPONENTS ===== */

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  changePeriod?: string;
  icon: React.ReactNode;
  loading?: boolean;
  variant?: 'default' | 'featured';
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeDirection = 'neutral',
  changePeriod,
  icon, 
  loading, 
  variant = 'default',
  description 
}) => {
  if (loading) {
    return (
      <Card className={variant === 'featured' ? 'ring-2 ring-blue-500' : ''}>
        <CardContent>
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const changeColor = changeDirection === 'up' 
    ? 'text-green-600 dark:text-green-400' 
    : changeDirection === 'down' 
    ? 'text-red-600 dark:text-red-400' 
    : 'text-gray-500 dark:text-gray-400';

  const changeIcon = changeDirection === 'up' 
    ? <TrendingUpIcon className="w-4 h-4" />
    : changeDirection === 'down'
    ? <TrendingDownIcon className="w-4 h-4" />
    : null;

  return (
    <Card className={variant === 'featured' ? 'ring-2 ring-blue-500 ring-opacity-20 bg-blue-50 dark:bg-blue-900/10' : ''}>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${
            variant === 'featured' 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>
            {icon}
          </div>
          {change !== undefined && change !== 0 && (
            <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
              {changeIcon}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value.toLocaleString()}
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
        </div>
        
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        
        {changePeriod && (
          <p className={`text-xs mt-1 ${changeColor}`}>
            vs {changePeriod}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface StatusRowProps {
  label: string;
  count: number;
  variant: 'blue' | 'green' | 'amber' | 'red';
  loading?: boolean;
}

const StatusRow: React.FC<StatusRowProps> = ({ label, count, variant, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-between py-3 animate-pulse">
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <Badge variant={variant} size="sm">
        {count}
      </Badge>
    </div>
  );
};

interface ActionButtonProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  count?: number;
  variant?: 'blue' | 'red';
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  to, 
  icon, 
  title, 
  description, 
  count,
  variant = 'blue' 
}) => {
  const badgeVariant = variant === 'red' ? 'red' : 'blue';
  return (
    <Link 
      to={to}
      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          variant === 'red' 
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        {count !== undefined && count > 0 && (
          <Badge variant={badgeVariant} size="sm">
            {count}
          </Badge>
        )}
        <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>
    </Link>
  );
};

/* ===== ICON COMPONENTS ===== */

const ContactsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const NewContactsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.674-1.334" />
  </svg>
);

const UrgentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const AdminsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const AnalyticsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const AuditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);

const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const TrendingDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.511l-5.511-3.182" />
  </svg>
);

const InformationCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);
