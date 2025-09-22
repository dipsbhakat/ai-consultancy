import { BusinessAnalytics } from '../../hooks/useAnalyticsAPI';

interface AnalyticsOverviewProps {
  analytics: BusinessAnalytics;
}

export const AnalyticsOverview = ({ analytics }: AnalyticsOverviewProps) => {
  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Mock previous period data for percentage changes
  // In a real implementation, you'd fetch previous period data
  const mockPreviousData = {
    visitors: Math.floor(analytics.visitors.total * 0.85),
    leads: Math.floor(analytics.leads.total * 0.75),
    qualified: Math.floor(analytics.leads.qualified * 0.8),
    conversions: Math.floor(analytics.funnel.converted * 0.9),
  };

  const stats = [
    {
      title: 'Total Visitors',
      value: analytics.visitors.total.toLocaleString(),
      change: calculatePercentageChange(analytics.visitors.total, mockPreviousData.visitors),
      icon: '👥',
      bgColor: 'bg-blue-500',
      description: `${analytics.visitors.unique} unique, ${analytics.visitors.returning} returning`,
    },
    {
      title: 'Total Leads',
      value: analytics.leads.total.toLocaleString(),
      change: calculatePercentageChange(analytics.leads.total, mockPreviousData.leads),
      icon: '🎯',
      bgColor: 'bg-green-500',
      description: `${analytics.leads.conversionRate.toFixed(1)}% conversion rate`,
    },
    {
      title: 'Qualified Leads',
      value: analytics.leads.qualified.toLocaleString(),
      change: calculatePercentageChange(analytics.leads.qualified, mockPreviousData.qualified),
      icon: '⭐',
      bgColor: 'bg-yellow-500',
      description: `${((analytics.leads.qualified / analytics.leads.total) * 100).toFixed(0)}% of total leads`,
    },
    {
      title: 'Conversions',
      value: analytics.funnel.converted.toLocaleString(),
      change: calculatePercentageChange(analytics.funnel.converted, mockPreviousData.conversions),
      icon: '💰',
      bgColor: 'bg-purple-500',
      description: `${((analytics.funnel.converted / analytics.funnel.visitors) * 100).toFixed(1)}% funnel conversion`,
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
        <p className="text-sm text-gray-600">Period: {analytics.period}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden border border-gray-200 rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 ${stat.bgColor} rounded-md flex items-center justify-center`}>
                    <span className="text-white text-sm">{stat.icon}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">{stat.description}</div>
                  <div className={`flex items-center text-xs font-medium ${
                    stat.change >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    <span className="mr-1">
                      {stat.change >= 0 ? '↗' : '↘'}
                    </span>
                    {Math.abs(stat.change).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${stat.bgColor}`}
                    style={{ 
                      width: `${Math.min(100, Math.max(10, (stat.change + 50)))}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Traffic Sources */}
      <div className="mt-8">
        <h3 className="text-md font-medium text-gray-900 mb-4">Top Traffic Sources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {analytics.topSources.map((source, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {source.source}
                  </div>
                  <div className="text-xs text-gray-600">
                    {source.visitors} visitors
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {source.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {source.conversions} conversions
                  </div>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ 
                    width: `${Math.min(100, (source.conversionRate / 20) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
