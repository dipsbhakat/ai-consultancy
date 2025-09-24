import React, { useEffect, useState } from 'react';
import Timeline, { TimelineEvent } from '../../design-system/Timeline';
import { Card, CardContent, CardHeader, Text, Button, Badge } from '../../design-system/components';
import { ThemeToggle } from '../../design-system/ThemeProvider';
import { adminAPI } from '../hooks/useAdminAPI';
import { AuditLog } from '../types';

/* ===== BACKEND DATA (AUDIT LOGS → TIMELINE) ===== */

const ActivityPage: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const hasMore = page < pages;
  const [variant, setVariant] = useState<'default' | 'compact' | 'detailed'>('default');
  const [groupBy, setGroupBy] = useState<'none' | 'date' | 'type'>('date');
  const [filter, setFilter] = useState<any>({});

  const mapLogToEvent = (log: AuditLog): TimelineEvent => {
    const type: TimelineEvent['type'] =
      log.resource === 'Authentication' ? 'system' :
      log.action === 'UPDATE' ? 'status_change' :
      log.action === 'DELETE' ? 'action' :
      'user';
    const title = `${log.action} ${log.resource}`;
    const descParts: string[] = [];
    if (log.oldValues || log.newValues) {
      const changes: string[] = [];
      if (log.newValues && log.oldValues) {
        Object.keys(log.newValues).forEach(key => {
          if (['password'].includes(key)) return;
          if (log.oldValues?.[key] !== log.newValues?.[key]) {
            changes.push(`${key}: ${String(log.oldValues?.[key])} → ${String(log.newValues?.[key])}`);
          }
        });
      }
      if (changes.length > 0) descParts.push(changes.join(', '));
    }
    if (log.ipAddress) descParts.push(`IP ${log.ipAddress}`);

    return {
      id: log.id,
      type,
      title,
      description: descParts.join(' · '),
      timestamp: log.createdAt,
      user: {
        id: log.admin.id,
        name: `${log.admin.firstName} ${log.admin.lastName}`
      },
      relatedEntity: log.resourceId ? { type: log.resource, id: log.resourceId, name: log.resourceId } : undefined,
    };
  };

  const loadPage = async (targetPage: number) => {
    const res = await adminAPI.getAuditLogs({ page: targetPage, limit: 25 });
    setPages(res.pagination.pages);
    const mapped = res.logs.map(mapLogToEvent);
    setEvents(prev => targetPage === 1 ? mapped : [...prev, ...mapped]);
    setPage(targetPage);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        await loadPage(1);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* ===== EVENT HANDLERS ===== */

  const handleLoadMore = async () => {
    if (!hasMore) return;
    await loadPage(page + 1);
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
            <h1 className="text-2xl font-bold text-gray-900">Activity Timeline</h1>
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
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
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
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
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
