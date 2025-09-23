import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SecurityDashboard } from '../components/SecurityDashboard';
import { DashboardStats } from '../types';
import { adminAPI } from '../hooks/useAdminAPI';
import { MetricCard } from '../../design-system/MetricCard';
import { Card, CardContent, Text, Button, Badge, Skeleton } from '../../design-system/components';

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
          <CardContent>
            <Text variant="heading-md" color="red" className="mb-2">
              Error Loading Dashboard
            </Text>
            <Text variant="body-md" color="secondary">
              {error}
            </Text>
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
            <Text variant="display-md" color="primary" className="mb-2">
              Dashboard
            </Text>
            <Text variant="body-lg" color="secondary">
              Overview of system activity and performance metrics
            </Text>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="green" size="sm">
              System Healthy
            </Badge>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => window.location.reload()}
              disabled={false}
              style={{ pointerEvents: 'auto' }}
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Contacts"
            value={stats?.contacts.total || 0}
            change={{
              value: 12.5,
              period: 'last month',
              direction: 'up'
            }}
            icon={<ContactsIcon />}
            loading={loading}
            description="All contact form submissions"
          />
          
          <MetricCard
            title="New Contacts"
            value={stats?.contacts.new || 0}
            change={{
              value: 8.2,
              period: 'last week',
              direction: 'up'
            }}
            icon={<NewContactsIcon />}
            loading={loading}
            variant="featured"
            description="Awaiting review"
          />
          
          <MetricCard
            title="Urgent Items"
            value={stats?.contacts.urgent || 0}
            change={{
              value: -2.1,
              period: 'yesterday',
              direction: 'down'
            }}
            icon={<UrgentIcon />}
            loading={loading}
            description="Require immediate attention"
          />
          
          <MetricCard
            title="Active Admins"
            value={stats?.admins.active || 0}
            change={{
              value: 0,
              period: 'last hour',
              direction: 'neutral'
            }}
            icon={<AdminsIcon />}
            loading={loading}
            description="Currently online"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Status Overview */}
          <Card variant="elevated">
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <Text variant="heading-md" color="primary">
                  Contact Status Breakdown
                </Text>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              
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
            <CardContent>
              <Text variant="heading-md" color="primary" className="mb-6">
                Quick Actions
              </Text>
              
              <div className="space-y-3">
                <ActionButton
                  to="/admin/contacts?status=NEW"
                  icon={<ContactsIcon />}
                  title="Review New Contacts"
                  description="Process recent submissions"
                  count={stats?.contacts.new || 0}
                />
                
                <ActionButton
                  to="/admin/contacts?priority=URGENT"
                  icon={<UrgentIcon />}
                  title="Handle Urgent Items"
                  description="Address critical issues"
                  count={stats?.contacts.urgent || 0}
                  variant="red"
                />
                
                <ActionButton
                  to="/admin/analytics"
                  icon={<AnalyticsIcon />}
                  title="View Analytics"
                  description="System performance metrics"
                />
                
                <ActionButton
                  to="/admin/audit"
                  icon={<AuditIcon />}
                  title="Audit Logs"
                  description="Review system activity"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Note */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">💡</span>
              </div>
              <div className="flex-1">
                <Text variant="heading-sm" color="primary" className="mb-2">
                  System Activity Summary
                </Text>
                <Text variant="body-md" color="secondary">
                  {stats?.contacts.recent || 0} new contacts received in the last 7 days. 
                  System performance is optimal with {stats?.admins.active || 0} administrators currently active.
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Dashboard */}
        <SecurityDashboard className="mt-8" />
      </div>
  );
};

/* ===== HELPER COMPONENTS ===== */

interface StatusRowProps {
  label: string;
  count: number;
  variant: 'blue' | 'green' | 'amber' | 'red';
  loading?: boolean;
}

const StatusRow: React.FC<StatusRowProps> = ({ label, count, variant, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-between py-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rectangular" width="40px" height="20px" className="rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2">
      <Text variant="body-md" color="secondary">
        {label}
      </Text>
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
  return (
    <Link 
      to={to}
      className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          variant === 'red' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <Text variant="label-md" color="primary" className="mb-1">
            {title}
          </Text>
          <Text variant="body-sm" color="secondary">
            {description}
          </Text>
        </div>
        {count !== undefined && count > 0 && (
          <Badge variant={variant} size="sm">
            {count}
          </Badge>
        )}
      </div>
    </Link>
  );
};

/* ===== ICON COMPONENTS ===== */

const ContactsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m22 21-3-3"/>
  </svg>
);

const NewContactsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="24" y2="8"/>
    <line x1="22" y1="5" x2="22" y2="11"/>
  </svg>
);

const UrgentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const AdminsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
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
