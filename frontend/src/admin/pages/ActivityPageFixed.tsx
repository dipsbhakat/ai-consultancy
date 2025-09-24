import React, { useState } from 'react';
import Timeline, { TimelineEvent } from '../../design-system/Timeline';
import { Card, CardContent, CardHeader, Text, Button, Badge } from '../../design-system/components';
import { ThemeToggle } from '../../design-system/ThemeProvider';

/* ===== SAMPLE DATA ===== */

const generateSampleEvents = (count: number): TimelineEvent[] => {
  const priorities: TimelineEvent['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const statuses: TimelineEvent['status'][] = ['pending', 'completed', 'failed'];
  
  const eventTemplates = [
    { type: 'contact', title: 'New contact submission', description: 'Customer inquiry received through website form' },
    { type: 'status_change', title: 'Status updated', description: 'Contact moved from New to In Review' },
    { type: 'note', title: 'Internal note added', description: 'Follow-up meeting scheduled for next week' },
    { type: 'action', title: 'Email sent', description: 'Welcome email sent to new contact' },
    { type: 'system', title: 'System notification', description: 'Automated backup completed successfully' },
    { type: 'user', title: 'User logged in', description: 'Admin user accessed the dashboard' },
  ];

  const users = [
    { id: '1', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John' },
    { id: '2', name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Jane' },
    { id: '3', name: 'Bob Johnson', avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Bob' },
    { id: '4', name: 'Sarah Wilson', avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Sarah' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    
    return {
      id: `event-${i + 1}`,
      type: template.type as TimelineEvent['type'],
      title: `${template.title} #${i + 1}`,
      description: template.description,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      user: Math.random() > 0.3 ? user : undefined,
      priority: Math.random() > 0.5 ? priorities[Math.floor(Math.random() * priorities.length)] : undefined,
      status: Math.random() > 0.4 ? statuses[Math.floor(Math.random() * statuses.length)] : undefined,
      relatedEntity: Math.random() > 0.6 ? {
        type: 'contact',
        id: `contact-${Math.floor(Math.random() * 100)}`,
        name: `Contact ${Math.floor(Math.random() * 100)}`
      } : undefined,
      metadata: {
        source: Math.random() > 0.5 ? 'website' : 'admin',
        automated: Math.random() > 0.7
      }
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const ActivityPage: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>(generateSampleEvents(50));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [variant, setVariant] = useState<'default' | 'compact' | 'detailed'>('default');
  const [groupBy, setGroupBy] = useState<'none' | 'date' | 'type'>('date');
  const [filter, setFilter] = useState<any>({});

  /* ===== EVENT HANDLERS ===== */

  const handleLoadMore = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEvents = generateSampleEvents(20);
    setEvents(prev => [...prev, ...newEvents]);
    
    // Stop loading more after a few loads
    if (events.length > 100) {
      setHasMore(false);
    }
    
    setLoading(false);
  };

  const handleEventClick = (event: TimelineEvent) => {
    console.log('Event clicked:', event);
    // Navigate to event detail or open modal
  };

  const clearFilter = () => {
    setFilter({});
  };

  /* ===== FILTER HELPERS ===== */

  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.types?.length > 0) count++;
    if (filter.users?.length > 0) count++;
    if (filter.dateRange) count++;
    return count;
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Activity Timeline</h1>
            <Text variant="body-md" color="secondary">
              Track all system events and user activities in real-time
            </Text>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle variant="switch" size="md" showLabel />
            
            <Button variant="primary" onClick={() => console.log('Add event')}>
              Add Event
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Variant Selector */}
          <div className="flex items-center gap-2">
            <Text variant="label-sm" color="secondary">View:</Text>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="compact">Compact</option>
              <option value="default">Default</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          {/* Group By */}
          <div className="flex items-center gap-2">
            <Text variant="label-sm" color="secondary">Group by:</Text>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="none">None</option>
              <option value="date">Date</option>
              <option value="type">Type</option>
            </select>
          </div>

          {/* Active Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="sm">
                {getActiveFilterCount()} filters active
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearFilter}>
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="body-sm" color="secondary">Total Events</Text>
                <Text variant="heading-lg" color="primary" className="mt-1">
                  {events.length.toLocaleString()}
                </Text>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ActivityIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="body-sm" color="secondary">Today's Events</Text>
                <Text variant="heading-lg" color="primary" className="mt-1">
                  {events.filter(e => {
                    const today = new Date();
                    const eventDate = new Date(e.timestamp);
                    return eventDate.toDateString() === today.toDateString();
                  }).length}
                </Text>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TodayIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="body-sm" color="secondary">Active Users</Text>
                <Text variant="heading-lg" color="primary" className="mt-1">
                  {new Set(events.filter(e => e.user).map(e => e.user!.id)).size}
                </Text>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UsersIcon />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Text variant="heading-md" color="primary">
              Activity Timeline
            </Text>
            
            <div className="flex items-center gap-2">
              <Text variant="body-sm" color="secondary">
                Showing {events.length} events
              </Text>
              {hasMore && (
                <Badge variant="neutral" size="sm">
                  More available
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Timeline
            events={events}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onEventClick={handleEventClick}
            variant={variant}
            groupBy={groupBy}
            filter={filter}
            maxHeight="800px"
          />
        </CardContent>
      </Card>
    </div>
  );
};

/* ===== ICONS ===== */

const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const TodayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default ActivityPage;
