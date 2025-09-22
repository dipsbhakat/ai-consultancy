import { useState, useEffect } from 'react';
import { TopContent, analyticsAPI } from '../../hooks/useAnalyticsAPI';

export const TopContentChart = () => {
  const [topContent, setTopContent] = useState<TopContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTopContent = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getTopPerformingContent(10);
      setTopContent(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load top content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopContent();
  }, []);

  const getPageName = (url: string): string => {
    if (!url || url === '/') return 'Home Page';
    
    // Extract page name from URL
    const path = url.split('?')[0]; // Remove query params
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) return 'Home Page';
    
    // Convert to readable names
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPageIcon = (url: string): string => {
    if (!url || url === '/') return '🏠';
    if (url.includes('about')) return '👥';
    if (url.includes('services')) return '⚙️';
    if (url.includes('contact')) return '📧';
    if (url.includes('blog')) return '📝';
    if (url.includes('pricing')) return '💰';
    return '📄';
  };

  const getConversionRateColor = (rate: number): string => {
    if (rate >= 10) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 5) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (rate >= 2) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
        <div className="text-red-600">{error}</div>
        <button
          onClick={loadTopContent}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (topContent.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
        <div className="text-center py-8 text-gray-500">
          No content data available
        </div>
      </div>
    );
  }

  const maxViews = Math.max(...topContent.map(content => content.views));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Performing Content</h3>
        <p className="text-sm text-gray-600">Pages ranked by views and conversion performance</p>
      </div>

      <div className="space-y-4">
        {topContent.map((content, index) => {
          const viewsPercentage = (content.views / maxViews) * 100;
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getPageIcon(content.pageUrl)}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {getPageName(content.pageUrl)}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {content.pageUrl}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {content.views.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {content.conversions}
                    </div>
                    <div className="text-xs text-gray-500">Conversions</div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getConversionRateColor(content.conversionRate)}`}>
                    {content.conversionRate.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Views Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(viewsPercentage, 5)}%` }}
                  ></div>
                </div>
                
                {/* Conversion overlay */}
                {content.conversionRate > 0 && (
                  <div
                    className="absolute top-0 h-2 bg-green-400 rounded-full opacity-60"
                    style={{ 
                      width: `${Math.min(viewsPercentage, (content.conversionRate / 20) * 100)}%`
                    }}
                  ></div>
                )}
              </div>

              {/* Performance insights */}
              <div className="mt-2 flex justify-between items-center text-xs text-gray-600">
                <span>
                  Rank #{index + 1} by views
                </span>
                <span>
                  {content.conversionRate > 5 ? '🔥 High converting' : 
                   content.conversionRate > 2 ? '📈 Good performance' : 
                   content.views > maxViews * 0.5 ? '👁️ Popular page' : 
                   '💡 Optimization opportunity'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {topContent.reduce((sum, content) => sum + content.views, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Views</div>
          </div>
          
          <div>
            <div className="text-lg font-bold text-green-600">
              {topContent.reduce((sum, content) => sum + content.conversions, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Conversions</div>
          </div>
          
          <div>
            <div className="text-lg font-bold text-purple-600">
              {topContent.length > 0 
                ? (topContent.reduce((sum, content) => sum + content.conversionRate, 0) / topContent.length).toFixed(1)
                : 0}%
            </div>
            <div className="text-xs text-gray-600">Avg Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Content Optimization Tips</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <div>• Focus on improving conversion rates for high-traffic pages</div>
          <div>• Consider A/B testing CTAs on pages with low conversion rates</div>
          <div>• Analyze user behavior on top-performing pages to replicate success</div>
        </div>
      </div>
    </div>
  );
};
