import { useState, useEffect } from 'react';
import { LeadScore, analyticsAPI } from '../../hooks/useAnalyticsAPI';

export const LeadScoringDashboard = () => {
  const [leadScores, setLeadScores] = useState<LeadScore[]>([]);
  const [qualityDistribution, setQualityDistribution] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadLeadScores = async () => {
    try {
      setLoading(true);
      const [scoresData, distributionData] = await Promise.all([
        analyticsAPI.getLeadScores(page, 10, selectedGrade || undefined),
        analyticsAPI.getLeadQualityDistribution(),
      ]);
      
      setLeadScores(scoresData.leadScores);
      setTotalPages(scoresData.totalPages);
      setQualityDistribution(distributionData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lead scores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeadScores();
  }, [page, selectedGrade]);

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreBarColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && leadScores.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
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
        <div className="text-red-600">{error}</div>
        <button
          onClick={loadLeadScores}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Lead Scoring Dashboard</h2>
          <p className="text-sm text-gray-600">Intelligent lead prioritization and quality analysis</p>
        </div>
        <select
          value={selectedGrade}
          onChange={(e) => {
            setSelectedGrade(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Grades</option>
          <option value="A">Grade A (80-100)</option>
          <option value="B">Grade B (60-79)</option>
          <option value="C">Grade C (40-59)</option>
          <option value="D">Grade D (0-39)</option>
        </select>
      </div>

      {/* Quality Distribution */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-3">Lead Quality Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(qualityDistribution).map(([grade, count]) => (
            <div key={grade} className={`p-4 rounded-lg border ${getGradeColor(grade)}`}>
              <div className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm font-medium">Grade {grade}</div>
                <div className="text-xs opacity-80">
                  {grade === 'A' && 'High Priority'}
                  {grade === 'B' && 'Good Quality'}
                  {grade === 'C' && 'Average'}
                  {grade === 'D' && 'Low Priority'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Scores Table */}
      <div className="overflow-hidden">
        <h3 className="text-md font-medium text-gray-900 mb-3">Recent Lead Scores</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score Breakdown
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leadScores.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lead.contact.name}
                      </div>
                      <div className="text-sm text-gray-500">{lead.contact.email}</div>
                      {lead.contact.company && (
                        <div className="text-xs text-gray-400">{lead.contact.company}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Demand:</span>
                        <span className="font-medium">{lead.demandScore}/40</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Engagement:</span>
                        <span className="font-medium">{lead.engagementScore}/30</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Quality:</span>
                        <span className="font-medium">{lead.qualityScore}/20</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Urgency:</span>
                        <span className="font-medium">{lead.urgencyScore}/10</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-bold text-gray-900 mr-2">
                        {lead.totalScore}/100
                      </div>
                      <div className="flex-1 max-w-20">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getScoreBarColor(lead.totalScore)}`}
                            style={{ width: `${lead.totalScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getGradeColor(lead.grade)}`}>
                      Grade {lead.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
