import React, { useState, useEffect } from 'react';
import { adminAPI } from '../hooks/useAdminAPI';

interface Session {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  lastActivity: string;
  createdAt: string;
}

interface SecurityDashboardProps {
  className?: string;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ className }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getActiveSessions();
      setSessions(response.sessions || []);
    } catch (err) {
      setError('Failed to load active sessions');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await adminAPI.logoutFromAllDevices();
      await loadSessions(); // Refresh the list
      // Note: This will also logout the current session, so the user will be redirected
    } catch (err) {
      setError('Failed to logout from all devices');
      console.error('Error logging out from all devices:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDeviceIcon = (deviceInfo: string) => {
    // Simple device detection based on device info hash
    if (deviceInfo.includes('mobile') || deviceInfo.includes('Mobile')) {
      return '📱';
    } else if (deviceInfo.includes('tablet') || deviceInfo.includes('iPad')) {
      return '💻';
    }
    return '🖥️';
  };

  if (loading) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
        <div className="flex gap-2">
          <button
            onClick={loadSessions}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleLogoutAllDevices}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            🚪 Logout All Devices
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔒</div>
          <p>No active sessions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            You have <strong>{sessions.length}</strong> active session{sessions.length !== 1 ? 's' : ''}
          </div>

          {sessions.map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getDeviceIcon(session.deviceInfo)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Device Session
                    </div>
                    <div className="text-sm text-gray-600">
                      IP: {session.ipAddress}
                    </div>
                    <div className="text-xs text-gray-500">
                      Device ID: {session.deviceInfo}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>Last active:</div>
                  <div className="font-medium">
                    {formatDate(session.lastActivity)}
                  </div>
                  <div className="text-xs mt-1">
                    Created: {formatDate(session.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🛡️ Security Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sessions automatically expire after 30 days of inactivity</li>
              <li>• Maximum of 5 concurrent sessions allowed</li>
              <li>• Access tokens refresh automatically every 15 minutes</li>
              <li>• All login activity is monitored and logged</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
