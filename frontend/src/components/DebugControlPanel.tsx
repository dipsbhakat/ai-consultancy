import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, BarChart3, TestTube, Target, Brain, Wrench } from 'lucide-react';

export const DebugControlPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dashboards, setDashboards] = useState({
    analytics: false,
    personalization: false,
    abTesting: false,
    performance: false,
    ai: false,
    leadScoring: false,
    aiSettings: false,
    businessIntelligence: false,
    competitiveIntelligence: false
  });

  useEffect(() => {
    // Only show in development
    if (!import.meta.env.DEV) return;

    // Load saved visibility states
    const savedStates = {
      analytics: localStorage.getItem('show_analytics_dashboard') === 'true',
      personalization: localStorage.getItem('show_personalization_dashboard') === 'true',
      abTesting: localStorage.getItem('show_ab_dashboard') === 'true',
      performance: localStorage.getItem('show_performance_dashboard') === 'true',
      ai: localStorage.getItem('show_ai_dashboard') === 'true',
      leadScoring: localStorage.getItem('show_lead_scoring_dashboard') === 'true',
      aiSettings: localStorage.getItem('show_ai_settings') === 'true',
      businessIntelligence: localStorage.getItem('show_business_intelligence_dashboard') === 'true',
      competitiveIntelligence: localStorage.getItem('show_competitive_intelligence') === 'true'
    };
    setDashboards(savedStates);

    // Keyboard shortcut to toggle control panel
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleDashboard = (dashboard: keyof typeof dashboards) => {
    const newState = !dashboards[dashboard];
    
    setDashboards(prev => ({
      ...prev,
      [dashboard]: newState
    }));

    // Save to localStorage
    const storageKey = `show_${
      dashboard === 'abTesting' ? 'ab' : 
      dashboard === 'aiSettings' ? 'ai_settings' : 
      dashboard === 'businessIntelligence' ? 'business_intelligence' :
      dashboard === 'competitiveIntelligence' ? 'competitive_intelligence' :
      dashboard
    }_dashboard`;
    localStorage.setItem(storageKey, newState.toString());

    // For AI settings, we need to reload the page to show the modal
    if (dashboard === 'aiSettings' && newState) {
      window.location.reload();
    }
  };

  const resetAllSettings = () => {
    const confirmReset = window.confirm('Reset all AI settings to defaults? This will reload the page.');
    if (confirmReset) {
      // Clear all AI configurations
      localStorage.removeItem('ai_advanced_config');
      localStorage.removeItem('ab_test_user_id');
      localStorage.removeItem('ab_tests');
      localStorage.removeItem('ab_test_assignments');
      localStorage.removeItem('personalization_user_profile');
      localStorage.removeItem('ai_personalization_data');
      
      // Reset dashboard visibility
      Object.keys(dashboards).forEach(key => {
        const storageKey = `show_${key === 'abTesting' ? 'ab' : key === 'aiSettings' ? 'ai_settings' : key}_dashboard`;
        localStorage.setItem(storageKey, 'false');
      });
      
      window.location.reload();
    }
  };

  const exportAllData = () => {
    const allData = {
      config: localStorage.getItem('ai_advanced_config'),
      userProfile: localStorage.getItem('personalization_user_profile'),
      aiData: localStorage.getItem('ai_personalization_data'),
      abTests: localStorage.getItem('ab_tests'),
      abAssignments: localStorage.getItem('ab_test_assignments'),
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-consultancy-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!import.meta.env.DEV) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-40 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Debug Control Panel (Ctrl+Shift+D)"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Control Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-2xl p-4 w-80 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">🛠️ Debug Control Panel</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="text-xs text-gray-500 mb-3">
              Toggle dashboards and AI components:
            </div>
            
            {/* Dashboard Toggles */}
            <div className="space-y-2">
              <DashboardToggle
                id="aiSettings"
                label="AI Advanced Settings"
                icon={Wrench}
                enabled={dashboards.aiSettings}
                onToggle={() => toggleDashboard('aiSettings')}
                color="purple"
              />
              
              <DashboardToggle
                id="ai"
                label="AI Personalization"
                icon={Brain}
                enabled={dashboards.ai}
                onToggle={() => toggleDashboard('ai')}
                color="blue"
              />
              
              <DashboardToggle
                id="leadScoring"
                label="Lead Scoring"
                icon={Target}
                enabled={dashboards.leadScoring}
                onToggle={() => toggleDashboard('leadScoring')}
                color="green"
              />
              
              <DashboardToggle
                id="businessIntelligence"
                label="Business Intelligence"
                icon={BarChart3}
                enabled={dashboards.businessIntelligence}
                onToggle={() => toggleDashboard('businessIntelligence')}
                color="purple"
              />
              
              <DashboardToggle
                id="competitiveIntelligence"
                label="Competitive Intel"
                icon={Eye}
                enabled={dashboards.competitiveIntelligence}
                onToggle={() => toggleDashboard('competitiveIntelligence')}
                color="red"
              />
              
              <DashboardToggle
                id="analytics"
                label="Analytics Dashboard"
                icon={BarChart3}
                enabled={dashboards.analytics}
                onToggle={() => toggleDashboard('analytics')}
                color="indigo"
              />
              
              <DashboardToggle
                id="abTesting"
                label="A/B Testing"
                icon={TestTube}
                enabled={dashboards.abTesting}
                onToggle={() => toggleDashboard('abTesting')}
                color="orange"
              />
              
              <DashboardToggle
                id="personalization"
                label="Personalization Debug"
                icon={Eye}
                enabled={dashboards.personalization}
                onToggle={() => toggleDashboard('personalization')}
                color="teal"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <button
                onClick={exportAllData}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                📤 Export All Data
              </button>
              
              <button
                onClick={resetAllSettings}
                className="w-full px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                🔄 Reset All Settings
              </button>
            </div>

            {/* Quick Stats */}
            <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
              <div>Active Dashboards: {Object.values(dashboards).filter(Boolean).length}/9</div>
              <div>Press Ctrl+Shift+D to toggle panel</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DashboardToggle: React.FC<{
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  onToggle: () => void;
  color: string;
}> = ({ label, icon: Icon, enabled, onToggle, color }) => {
  const colorClasses = {
    purple: enabled ? 'bg-purple-100 border-purple-200 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-600',
    blue: enabled ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600',
    green: enabled ? 'bg-green-100 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600',
    indigo: enabled ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-200 text-gray-600',
    orange: enabled ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-600',
    teal: enabled ? 'bg-teal-100 border-teal-200 text-teal-700' : 'bg-gray-50 border-gray-200 text-gray-600',
    red: enabled ? 'bg-red-100 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-600'
  };

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-2 rounded-lg border transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {enabled ? (
        <Eye className="w-4 h-4" />
      ) : (
        <EyeOff className="w-4 h-4" />
      )}
    </button>
  );
};

export default DebugControlPanel;
