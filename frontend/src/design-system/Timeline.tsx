import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, Badge, Button } from './components';

/* ===== TIMELINE TYPES ===== */

export interface TimelineEvent {
  id: string;
  type: 'contact' | 'status_change' | 'note' | 'action' | 'system' | 'user';
  title: string;
  description?: string;
  timestamp: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'completed' | 'failed';
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
}

export interface TimelineProps {
  events: TimelineEvent[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onEventClick?: (event: TimelineEvent) => void;
  variant?: 'default' | 'compact' | 'detailed';
  groupBy?: 'none' | 'date' | 'type';
  filter?: {
    types?: string[];
    users?: string[];
    dateRange?: {
      from: Date;
      to: Date;
    };
  };
  realtime?: boolean;
  maxHeight?: string;
}

/* ===== TIMELINE COMPONENT ===== */

export const Timeline: React.FC<TimelineProps> = ({
  events,
  loading = false,
  hasMore = false,
  onLoadMore,
  onEventClick,
  variant = 'default',
  groupBy = 'date',
  filter,
  realtime = false,
  maxHeight = '600px'
}) => {
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>(events);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Filter events based on filter criteria
  useEffect(() => {
    let filtered = [...events];

    if (filter) {
      if (filter.types && filter.types.length > 0) {
        filtered = filtered.filter(event => filter.types!.includes(event.type));
      }

      if (filter.users && filter.users.length > 0) {
        filtered = filtered.filter(event => 
          event.user && filter.users!.includes(event.user.id)
        );
      }

      if (filter.dateRange) {
        const { from, to } = filter.dateRange;
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.timestamp);
          return eventDate >= from && eventDate <= to;
        });
      }
    }

    setFilteredEvents(filtered);
  }, [events, filter]);

  // Infinite scroll implementation
  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error('Failed to load more events:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [onLoadMore, isLoadingMore, hasMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreTriggerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, onLoadMore, handleLoadMore]);

  // Group events if needed
  const groupedEvents = React.useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', title: '', events: filteredEvents }];
    }

    if (groupBy === 'date') {
      const groups: Record<string, TimelineEvent[]> = {};
      
      filteredEvents.forEach(event => {
        const date = new Date(event.timestamp).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(event);
      });

      return Object.entries(groups)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([date, events]) => ({
          key: date,
          title: formatGroupDate(date),
          events: events.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        }));
    }

    if (groupBy === 'type') {
      const groups: Record<string, TimelineEvent[]> = {};
      
      filteredEvents.forEach(event => {
        if (!groups[event.type]) {
          groups[event.type] = [];
        }
        groups[event.type].push(event);
      });

      return Object.entries(groups).map(([type, events]) => ({
        key: type,
        title: formatEventType(type),
        events: events.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      }));
    }

    return [{ key: 'all', title: '', events: filteredEvents }];
  }, [filteredEvents, groupBy]);

  if (loading && filteredEvents.length === 0) {
    return <TimelineSkeleton variant={variant} />;
  }

  return (
    <div 
      className={`timeline timeline-${variant}`}
      style={{ maxHeight }}
    >
      <div 
        ref={scrollContainerRef}
        className="timeline-scroll-container"
      >
        {groupedEvents.map(group => (
          <div key={group.key} className="timeline-group">
            {group.title && (
              <div className="timeline-group-header">
                <Text variant="label-sm" weight="medium" color="secondary">
                  {group.title}
                </Text>
              </div>
            )}
            
            <div className="timeline-events">
              {group.events.map((event, index) => (
                <TimelineEventItem
                  key={event.id}
                  event={event}
                  variant={variant}
                  onClick={onEventClick}
                  isLast={index === group.events.length - 1}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Load more trigger */}
        {hasMore && (
          <div ref={loadMoreTriggerRef} className="timeline-load-more">
            {isLoadingMore ? (
              <div className="timeline-loading">
                <div className="timeline-loading-spinner" />
                <Text variant="body-sm" color="secondary">
                  Loading more events...
                </Text>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLoadMore}
                className="timeline-load-more-button"
              >
                Load more events
              </Button>
            )}
          </div>
        )}

        {/* Empty state */}
        {filteredEvents.length === 0 && !loading && (
          <div className="timeline-empty">
            <TimelineEmptyIcon />
            <Text variant="heading-sm" color="secondary" className="mt-3">
              No activity yet
            </Text>
            <Text variant="body-sm" color="tertiary">
              Events and updates will appear here as they happen.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== TIMELINE EVENT ITEM ===== */

interface TimelineEventItemProps {
  event: TimelineEvent;
  variant: 'default' | 'compact' | 'detailed';
  onClick?: (event: TimelineEvent) => void;
  isLast: boolean;
}

const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  event,
  variant,
  onClick,
  isLast
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div 
      className={`timeline-event ${onClick ? 'timeline-event-clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="timeline-event-marker">
        <div className={`timeline-event-icon timeline-event-icon-${event.type}`}>
          <EventTypeIcon type={event.type} />
        </div>
        {!isLast && <div className="timeline-event-line" />}
      </div>

      <div className="timeline-event-content">
        <div className="timeline-event-header">
          <div className="timeline-event-title">
            <Text variant="label-sm" weight="medium" color="primary">
              {event.title}
            </Text>
            {event.priority && (
              <Badge 
                variant={getPriorityVariant(event.priority)} 
                size="sm"
              >
                {event.priority}
              </Badge>
            )}
            {event.status && (
              <Badge 
                variant={getStatusVariant(event.status)} 
                size="sm"
              >
                {event.status}
              </Badge>
            )}
          </div>
          
          <div className="timeline-event-meta">
            <Text variant="body-sm" color="tertiary">
              {formatTimestamp(event.timestamp)}
            </Text>
            {event.user && variant !== 'compact' && (
              <div className="timeline-event-user">
                {event.user.avatar && (
                  <img 
                    src={event.user.avatar} 
                    alt={event.user.name}
                    className="timeline-user-avatar"
                  />
                )}
                <Text variant="body-sm" color="secondary">
                  {event.user.name}
                </Text>
              </div>
            )}
          </div>
        </div>

        {event.description && variant !== 'compact' && (
          <div className="timeline-event-description">
            <Text variant="body-sm" color="secondary">
              {event.description}
            </Text>
          </div>
        )}

        {event.relatedEntity && variant === 'detailed' && (
          <div className="timeline-event-related">
            <Text variant="body-sm" color="tertiary">
              Related to: <span className="text-primary">{event.relatedEntity.name}</span>
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== HELPER COMPONENTS ===== */

const TimelineSkeleton: React.FC<{ variant: string }> = ({ variant }) => (
  <div className={`timeline timeline-${variant} timeline-skeleton`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="timeline-event">
        <div className="timeline-event-marker">
          <div className="timeline-event-icon skeleton-circle" />
          <div className="timeline-event-line" />
        </div>
        <div className="timeline-event-content">
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-description" />
          <div className="skeleton-line skeleton-line-meta" />
        </div>
      </div>
    ))}
  </div>
);

/* ===== UTILITY FUNCTIONS ===== */

const formatGroupDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

const formatEventType = (type: string): string => {
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

const getPriorityVariant = (priority: string) => {
  const variants = {
    low: 'neutral',
    medium: 'blue',
    high: 'amber',
    urgent: 'red'
  } as const;
  return variants[priority as keyof typeof variants] || 'neutral';
};

const getStatusVariant = (status: string) => {
  const variants = {
    pending: 'amber',
    completed: 'green',
    failed: 'red'
  } as const;
  return variants[status as keyof typeof variants] || 'neutral';
};

/* ===== ICONS ===== */

const EventTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  const icons = {
    contact: <ContactIcon />,
    status_change: <StatusIcon />,
    note: <NoteIcon />,
    action: <ActionIcon />,
    system: <SystemIcon />,
    user: <UserIcon />
  };
  
  return icons[type as keyof typeof icons] || <DefaultIcon />;
};

const ContactIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const StatusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c1.5 0 2.9.4 4.1 1"/>
  </svg>
);

const NoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const ActionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c1.5 0 2.9.4 4.1 1"/>
  </svg>
);

const SystemIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const DefaultIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const TimelineEmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="6" x2="12" y2="12"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
  </svg>
);

export default Timeline;
