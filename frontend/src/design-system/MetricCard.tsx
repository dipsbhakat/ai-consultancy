import React from 'react';
import { Card, CardContent, Text, Badge, Skeleton } from '../design-system/components';

/* ===== METRIC CARD COMPONENT ===== */

export interface TrendData {
  value: number;
  period: string;
  direction: 'up' | 'down' | 'neutral';
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: TrendData;
  icon?: React.ReactNode;
  variant?: 'default' | 'featured' | 'compact';
  loading?: boolean;
  description?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'default',
  loading = false,
  description,
  className = ''
}) => {
  if (loading) {
    return <MetricCardSkeleton variant={variant} />;
  }

  const cardVariant = variant === 'featured' ? 'elevated' : 'default';
  const cardClasses = `metric-card metric-card-${variant} ${className}`;

  return (
    <Card variant={cardVariant} className={cardClasses}>
      <CardContent>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Text variant="label-sm" color="secondary" className="mb-1">
              {title}
            </Text>
            {description && (
              <Text variant="body-sm" color="tertiary" className="mb-2">
                {description}
              </Text>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 ml-3">
              <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-secondary">
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-4">
          <Text 
            variant={variant === 'compact' ? 'heading-lg' : 'display-sm'} 
            color="primary"
            className="tabular-nums"
          >
            {typeof value === 'number' ? formatNumber(value) : value}
          </Text>
        </div>

        {/* Trend */}
        {change && (
          <TrendIndicator 
            value={change.value}
            period={change.period}
            direction={change.direction}
            compact={variant === 'compact'}
          />
        )}
      </CardContent>
    </Card>
  );
};

/* ===== TREND INDICATOR COMPONENT ===== */

interface TrendIndicatorProps {
  value: number;
  period: string;
  direction: 'up' | 'down' | 'neutral';
  compact?: boolean;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  period,
  direction
}) => {
  const isPositive = direction === 'up';
  const isNegative = direction === 'down';

  const badgeVariant = isPositive ? 'green' : isNegative ? 'red' : 'neutral';
  const iconMap = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  const formattedValue = Math.abs(value).toFixed(1);

  return (
    <div className="flex items-center justify-between">
      <Badge variant={badgeVariant} size="sm" className="font-medium">
        <span className="mr-1">{iconMap[direction]}</span>
        {formattedValue}%
      </Badge>
      <Text variant="label-sm" color="tertiary">
        vs {period}
      </Text>
    </div>
  );
};

/* ===== METRIC CARD SKELETON ===== */

interface MetricCardSkeletonProps {
  variant?: 'default' | 'featured' | 'compact';
}

const MetricCardSkeleton: React.FC<MetricCardSkeletonProps> = ({ 
  variant = 'default' 
}) => {
  const cardVariant = variant === 'featured' ? 'elevated' : 'default';

  return (
    <Card variant={cardVariant} className={`metric-card metric-card-${variant}`}>
      <CardContent>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Skeleton variant="text" width="60%" className="mb-2" />
            {variant !== 'compact' && (
              <Skeleton variant="text" width="80%" height="14px" />
            )}
          </div>
          <Skeleton variant="circular" width="40px" height="40px" />
        </div>

        {/* Value */}
        <div className="mb-4">
          <Skeleton 
            variant="text" 
            width="40%" 
            height={variant === 'compact' ? '24px' : '32px'}
          />
        </div>

        {/* Trend */}
        <div className="flex items-center justify-between">
          <Skeleton variant="rectangular" width="60px" height="20px" className="rounded-full" />
          <Skeleton variant="text" width="50px" height="14px" />
        </div>
      </CardContent>
    </Card>
  );
};

/* ===== UTILITY FUNCTIONS ===== */

const formatNumber = (num: number): string => {
  const absNum = Math.abs(num);
  
  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (absNum >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (absNum >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toLocaleString();
  }
};

/* ===== ADDITIONAL STYLES ===== */

const metricCardStyles = `
.metric-card {
  transition: all var(--duration-normal) var(--ease-in-out);
}

.metric-card-featured {
  background: linear-gradient(135deg, var(--surface-0) 0%, var(--surface-1) 100%);
  border: 1px solid var(--border-emphasis);
}

.metric-card-compact .card-content {
  padding: var(--space-4);
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

@media (max-width: 640px) {
  .metric-card-featured,
  .metric-card-default {
    padding: var(--space-4);
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = metricCardStyles;
  document.head.appendChild(styleSheet);
}

export default MetricCard;
