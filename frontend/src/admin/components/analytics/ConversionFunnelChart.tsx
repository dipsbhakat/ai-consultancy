import { useState, useEffect } from 'react';
import { ConversionFunnelData, analyticsAPI } from '../../hooks/useAnalyticsAPI';

interface ConversionFunnelChartProps {
  startDate: string;
  endDate: string;
}

export const ConversionFunnelChart = ({ startDate, endDate }: ConversionFunnelChartProps) => {
  const [funnelData, setFunnelData] = useState<ConversionFunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFunnelData = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getConversionFunnel(startDate, endDate);
      setFunnelData(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load funnel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunnelData();
  }, [startDate, endDate]);

  const getStageColor = (index: number): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-yellow-500',
      'bg-orange-500',
      'bg-purple-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  const getStageIcon = (stage: string): string => {
    switch (stage.toLowerCase()) {
      case 'visitor': return '👁️';
      case 'engaged': return '👆';
      case 'lead': return '🎯';
      case 'contact': return '📧';
      case 'qualified': return '⭐';
      case 'converted': return '💰';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="text-red-600">{error}</div>
        <button
          onClick={loadFunnelData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!funnelData || funnelData.stages.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="text-center py-8 text-gray-500">
          No funnel data available for the selected period
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...funnelData.stages.map(stage => stage.count));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
        <p className="text-sm text-gray-600">User journey through the sales process</p>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-3">
        {funnelData.stages.map((stage, index) => {
          const widthPercentage = (stage.count / maxCount) * 100;
          const dropOff = funnelData.dropOffAnalysis.find(d => d.from === stage.stage);
          
          return (
            <div key={stage.stage} className="relative">
              {/* Stage Bar */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-sm font-medium text-gray-700">
                    {getStageIcon(stage.stage)} {stage.stage}
                  </span>
                </div>
                
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-8 flex items-center">
                    <div
                      className={`h-8 rounded-full ${getStageColor(index)} flex items-center justify-between px-3 text-white text-sm font-medium transition-all duration-300`}
                      style={{ width: `${Math.max(widthPercentage, 15)}%` }}
                    >
                      <span>{stage.count.toLocaleString()}</span>
                      <span>{stage.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drop-off indicator */}
              {dropOff && dropOff.dropOffRate > 0 && (
                <div className="ml-24 mt-1 text-xs text-red-600">
                  ↘ {dropOff.dropOffRate.toFixed(1)}% drop-off to {dropOff.to}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {funnelData.stages[0]?.count.toLocaleString() || 0}
            </div>
            <div className="text-xs text-gray-600">Total Visitors</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {funnelData.stages[funnelData.stages.length - 1]?.count.toLocaleString() || 0}
            </div>
            <div className="text-xs text-gray-600">Final Conversions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {funnelData.stages.length > 0 && funnelData.stages[0].count > 0 
                ? ((funnelData.stages[funnelData.stages.length - 1]?.count || 0) / funnelData.stages[0].count * 100).toFixed(1)
                : 0}%
            </div>
            <div className="text-xs text-gray-600">Overall Conversion</div>
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">🎯 Optimization Opportunities</h4>
        <div className="space-y-2">
          {funnelData.dropOffAnalysis
            .filter(dropOff => dropOff.dropOffRate > 30)
            .slice(0, 2)
            .map((dropOff, index) => (
              <div key={index} className="text-xs bg-yellow-50 border border-yellow-200 rounded-md p-2">
                <span className="font-medium text-yellow-800">
                  High drop-off ({dropOff.dropOffRate.toFixed(1)}%) from {dropOff.from} to {dropOff.to}
                </span>
                <span className="text-yellow-700 ml-2">
                  - Consider improving user experience at this stage
                </span>
              </div>
            ))}
          
          {funnelData.dropOffAnalysis.every(dropOff => dropOff.dropOffRate <= 30) && (
            <div className="text-xs bg-green-50 border border-green-200 rounded-md p-2">
              <span className="text-green-800">✅ Funnel performance looks healthy with reasonable drop-off rates</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
