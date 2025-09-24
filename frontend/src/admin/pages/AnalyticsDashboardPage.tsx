import { useState, useEffect } from 'react';
import { BusinessAnalytics, analyticsAPI } from '../hooks/useAnalyticsAPI';
import { AnalyticsOverview, LeadScoringDashboard, ConversionFunnelChart, TopContentChart, DateRangePicker } from '../components/analytics';

export const AnalyticsDashboardPage = () => {
  const [businessAnalytics, setBusinessAnalytics] = useState<BusinessAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date }>(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return { startDate: start, endDate: end };
  });

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getBusinessAnalytics(
        dateRange.startDate.toISOString(),
        dateRange.endDate.toISOString()
      );
      setBusinessAnalytics(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const handleDateRangeChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
          <button
            onClick={loadAnalytics}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
            <p className="text-gray-600">Analytics, lead scoring, and performance insights</p>
          </div>
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
        </div>

        {/* Analytics Overview */}
        {businessAnalytics && (
          <AnalyticsOverview analytics={businessAnalytics} />
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Scoring Dashboard */}
          <div className="lg:col-span-2">
            <LeadScoringDashboard />
          </div>

          {/* Conversion Funnel */}
          <ConversionFunnelChart 
            startDate={dateRange.startDate.toISOString()} 
            endDate={dateRange.endDate.toISOString()} 
          />

          {/* Top Content Performance */}
          <TopContentChart />
        </div>

        {/* Performance Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📊 Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Conversion Rate</div>
              <div className="text-2xl font-bold text-blue-900">
                {businessAnalytics?.leads.conversionRate.toFixed(1)}%
              </div>
              <div className="text-xs text-blue-700">
                {businessAnalytics?.leads.total} leads from {businessAnalytics?.visitors.total} visitors
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Average Lead Score</div>
              <div className="text-2xl font-bold text-blue-900">
                {businessAnalytics?.leads.avgScore.toFixed(0)}/100
              </div>
              <div className="text-xs text-blue-700">
                {businessAnalytics?.leads.qualified} qualified leads ({((businessAnalytics?.leads.qualified || 0) / (businessAnalytics?.leads.total || 1) * 100).toFixed(0)}%)
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Visitor Quality</div>
              <div className="text-2xl font-bold text-blue-900">
                {businessAnalytics ? ((businessAnalytics.visitors.returning / businessAnalytics.visitors.total) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-xs text-blue-700">
                {businessAnalytics?.visitors.returning} returning of {businessAnalytics?.visitors.total} total
              </div>
            </div>
          </div>
        </div>
  </div>
  );
};
