import React, { useState, useEffect } from 'react';
import { Settings, Brain, Target, TestTube, BarChart3, Bot, Shield, Zap } from 'lucide-react';

// AI Configuration Interfaces
interface AIPersonalizationConfig {
  enabled: boolean;
  learningRate: number;
  confidenceThreshold: number;
  adaptationSpeed: 'slow' | 'medium' | 'fast';
  behaviorTrackingDepth: number;
  predictionAccuracy: number;
  contentRecommendations: boolean;
  realTimeAdaptation: boolean;
}

interface LeadScoringConfig {
  enabled: boolean;
  scoringWeights: {
    demographic: number;
    behavioral: number;
    engagement: number;
    intent: number;
    fit: number;
    urgency: number;
  };
  thresholds: {
    hot: number;
    warm: number;
    cold: number;
  };
  autoQualification: boolean;
  industryAdjustments: boolean;
  timeDecayFactor: number;
  minimumInteractions: number;
}

interface ChatbotConfig {
  enabled: boolean;
  responseDelay: number;
  proactiveMode: boolean;
  qualificationThreshold: number;
  conversationDepth: number;
  sentimentAnalysis: boolean;
  multiLanguage: boolean;
  handoffToHuman: boolean;
  contextMemory: number; // days
}

interface ABTestConfig {
  enabled: boolean;
  defaultConfidenceLevel: number;
  minimumSampleSize: number;
  maxTestDuration: number; // days
  banditEnabled: boolean;
  explorationRate: number;
  statisticalRigor: 'standard' | 'strict' | 'relaxed';
  autoWinnerSelection: boolean;
}

interface AnalyticsConfig {
  enabled: boolean;
  trackingLevel: 'basic' | 'detailed' | 'comprehensive';
  dataRetention: number; // days
  realTimeUpdates: boolean;
  heatmapEnabled: boolean;
  performanceTracking: boolean;
  privacyMode: boolean;
  anonymizeData: boolean;
}

interface GlobalAIConfig {
  aiPersonalization: AIPersonalizationConfig;
  leadScoring: LeadScoringConfig;
  chatbot: ChatbotConfig;
  abTesting: ABTestConfig;
  analytics: AnalyticsConfig;
  globalSettings: {
    debugMode: boolean;
    performanceMode: 'balanced' | 'performance' | 'accuracy';
    dataProcessingMode: 'realtime' | 'batch';
    fallbackMode: boolean;
    apiRateLimiting: boolean;
  };
}

// Default configurations
const getDefaultConfig = (): GlobalAIConfig => ({
  aiPersonalization: {
    enabled: true,
    learningRate: 0.1,
    confidenceThreshold: 0.75,
    adaptationSpeed: 'medium',
    behaviorTrackingDepth: 10,
    predictionAccuracy: 0.85,
    contentRecommendations: true,
    realTimeAdaptation: true
  },
  leadScoring: {
    enabled: true,
    scoringWeights: {
      demographic: 0.20,
      behavioral: 0.25,
      engagement: 0.20,
      intent: 0.15,
      fit: 0.10,
      urgency: 0.10
    },
    thresholds: {
      hot: 80,
      warm: 60,
      cold: 40
    },
    autoQualification: true,
    industryAdjustments: true,
    timeDecayFactor: 0.95,
    minimumInteractions: 3
  },
  chatbot: {
    enabled: true,
    responseDelay: 1500,
    proactiveMode: true,
    qualificationThreshold: 0.7,
    conversationDepth: 5,
    sentimentAnalysis: true,
    multiLanguage: false,
    handoffToHuman: true,
    contextMemory: 7
  },
  abTesting: {
    enabled: true,
    defaultConfidenceLevel: 95,
    minimumSampleSize: 100,
    maxTestDuration: 30,
    banditEnabled: true,
    explorationRate: 0.1,
    statisticalRigor: 'standard',
    autoWinnerSelection: false
  },
  analytics: {
    enabled: true,
    trackingLevel: 'detailed',
    dataRetention: 90,
    realTimeUpdates: true,
    heatmapEnabled: true,
    performanceTracking: true,
    privacyMode: false,
    anonymizeData: true
  },
  globalSettings: {
    debugMode: false,
    performanceMode: 'balanced',
    dataProcessingMode: 'realtime',
    fallbackMode: true,
    apiRateLimiting: true
  }
});

export const AISettingsDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('personalization');
  const [config, setConfig] = useState<GlobalAIConfig>(getDefaultConfig());
  const [hasChanges, setHasChanges] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('ai_advanced_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.warn('Failed to load AI config, using defaults');
      }
    }

    // Check if settings dashboard should be visible
    const showSettings = localStorage.getItem('show_ai_settings') === 'true';
    setIsVisible(import.meta.env.DEV && showSettings);
  }, []);

  const updateConfig = (section: keyof GlobalAIConfig, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
    setHasChanges(true);
  };

  const applySettings = async () => {
    setIsApplying(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('ai_advanced_config', JSON.stringify(config));
      
      // Apply dashboard visibility settings
      localStorage.setItem('show_ai_dashboard', config.aiPersonalization.enabled.toString());
      localStorage.setItem('show_lead_scoring_dashboard', config.leadScoring.enabled.toString());
      localStorage.setItem('show_ab_testing_dashboard', config.abTesting.enabled.toString());
      localStorage.setItem('show_analytics_dashboard', config.analytics.enabled.toString());
      
      // Simulate API call to apply settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      
      // Reload page to apply changes
      window.location.reload();
    } catch (error) {
      console.error('Failed to apply settings:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const resetToDefaults = () => {
    setConfig(getDefaultConfig());
    setHasChanges(true);
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  const tabs = [
    { id: 'personalization', label: 'AI Personalization', icon: Brain },
    { id: 'scoring', label: 'Lead Scoring', icon: Target },
    { id: 'chatbot', label: 'AI Chatbot', icon: Bot },
    { id: 'testing', label: 'A/B Testing', icon: TestTube },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'global', label: 'Global Settings', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Advanced Settings</h2>
                <p className="text-blue-100">Configure your AI-powered optimization systems</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'personalization' && (
              <PersonalizationSettings 
                config={config.aiPersonalization} 
                onChange={(updates) => updateConfig('aiPersonalization', updates)}
              />
            )}
            {activeTab === 'scoring' && (
              <LeadScoringSettings 
                config={config.leadScoring} 
                onChange={(updates) => updateConfig('leadScoring', updates)}
              />
            )}
            {activeTab === 'chatbot' && (
              <ChatbotSettings 
                config={config.chatbot} 
                onChange={(updates) => updateConfig('chatbot', updates)}
              />
            )}
            {activeTab === 'testing' && (
              <ABTestSettings 
                config={config.abTesting} 
                onChange={(updates) => updateConfig('abTesting', updates)}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsSettings 
                config={config.analytics} 
                onChange={(updates) => updateConfig('analytics', updates)}
              />
            )}
            {activeTab === 'global' && (
              <GlobalSettings 
                config={config.globalSettings} 
                onChange={(updates) => updateConfig('globalSettings', updates)}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Reset to Defaults
            </button>
            <button
              onClick={exportConfig}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Export Config
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsVisible(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={applySettings}
              disabled={!hasChanges || isApplying}
              className={`px-6 py-2 rounded-lg font-medium ${
                hasChanges && !isApplying
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isApplying ? 'Applying...' : 'Apply Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual setting components
const PersonalizationSettings: React.FC<{
  config: AIPersonalizationConfig;
  onChange: (updates: Partial<AIPersonalizationConfig>) => void;
}> = ({ config, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">AI Personalization Settings</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enable AI Personalization
          </label>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Rate: {config.learningRate}
          </label>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={config.learningRate}
            onChange={(e) => onChange({ learningRate: parseFloat(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">How quickly the AI adapts to new behavior</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confidence Threshold: {config.confidenceThreshold}
          </label>
          <input
            type="range"
            min="0.5"
            max="0.99"
            step="0.01"
            value={config.confidenceThreshold}
            onChange={(e) => onChange({ confidenceThreshold: parseFloat(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Minimum confidence required for personalization</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adaptation Speed
          </label>
          <select
            value={config.adaptationSpeed}
            onChange={(e) => onChange({ adaptationSpeed: e.target.value as 'slow' | 'medium' | 'fast' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="slow">Slow (Conservative)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="fast">Fast (Aggressive)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behavior Tracking Depth: {config.behaviorTrackingDepth}
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={config.behaviorTrackingDepth}
            onChange={(e) => onChange({ behaviorTrackingDepth: parseInt(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Number of user actions to track for patterns</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prediction Accuracy Target: {(config.predictionAccuracy * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.7"
            max="0.99"
            step="0.01"
            value={config.predictionAccuracy}
            onChange={(e) => onChange({ predictionAccuracy: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.contentRecommendations}
              onChange={(e) => onChange({ contentRecommendations: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Enable Content Recommendations</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.realTimeAdaptation}
              onChange={(e) => onChange({ realTimeAdaptation: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Real-Time Adaptation</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const LeadScoringSettings: React.FC<{
  config: LeadScoringConfig;
  onChange: (updates: Partial<LeadScoringConfig>) => void;
}> = ({ config, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">Lead Scoring Settings</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enable Lead Scoring
          </label>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">Scoring Weights</h4>
          <div className="space-y-2">
            {Object.entries(config.scoringWeights).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm text-gray-600 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {(value * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={value}
                  onChange={(e) => onChange({
                    scoringWeights: {
                      ...config.scoringWeights,
                      [key]: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">Score Thresholds</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Hot Leads: {config.thresholds.hot}
              </label>
              <input
                type="range"
                min="70"
                max="100"
                value={config.thresholds.hot}
                onChange={(e) => onChange({
                  thresholds: {
                    ...config.thresholds,
                    hot: parseInt(e.target.value)
                  }
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Warm Leads: {config.thresholds.warm}
              </label>
              <input
                type="range"
                min="40"
                max="80"
                value={config.thresholds.warm}
                onChange={(e) => onChange({
                  thresholds: {
                    ...config.thresholds,
                    warm: parseInt(e.target.value)
                  }
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Cold Leads: {config.thresholds.cold}
              </label>
              <input
                type="range"
                min="20"
                max="60"
                value={config.thresholds.cold}
                onChange={(e) => onChange({
                  thresholds: {
                    ...config.thresholds,
                    cold: parseInt(e.target.value)
                  }
                })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Decay Factor: {config.timeDecayFactor}
          </label>
          <input
            type="range"
            min="0.8"
            max="0.99"
            step="0.01"
            value={config.timeDecayFactor}
            onChange={(e) => onChange({ timeDecayFactor: parseFloat(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">How quickly old interactions lose importance</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Interactions: {config.minimumInteractions}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={config.minimumInteractions}
            onChange={(e) => onChange({ minimumInteractions: parseInt(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Minimum interactions before scoring</p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.autoQualification}
              onChange={(e) => onChange({ autoQualification: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Auto-qualification</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.industryAdjustments}
              onChange={(e) => onChange({ industryAdjustments: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Industry-based adjustments</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const ChatbotSettings: React.FC<{
  config: ChatbotConfig;
  onChange: (updates: Partial<ChatbotConfig>) => void;
}> = ({ config, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">AI Chatbot Settings</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enable AI Chatbot
          </label>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Response Delay: {config.responseDelay}ms
          </label>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={config.responseDelay}
            onChange={(e) => onChange({ responseDelay: parseInt(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Delay before bot responds (for natural feel)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Qualification Threshold: {config.qualificationThreshold}
          </label>
          <input
            type="range"
            min="0.5"
            max="0.9"
            step="0.05"
            value={config.qualificationThreshold}
            onChange={(e) => onChange({ qualificationThreshold: parseFloat(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Confidence required to qualify a lead</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conversation Depth: {config.conversationDepth}
          </label>
          <input
            type="range"
            min="3"
            max="15"
            value={config.conversationDepth}
            onChange={(e) => onChange({ conversationDepth: parseInt(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Maximum exchanges before handoff</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Context Memory: {config.contextMemory} days
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={config.contextMemory}
            onChange={(e) => onChange({ contextMemory: parseInt(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">How long to remember conversation history</p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.proactiveMode}
              onChange={(e) => onChange({ proactiveMode: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Proactive engagement</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.sentimentAnalysis}
              onChange={(e) => onChange({ sentimentAnalysis: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Sentiment analysis</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.multiLanguage}
              onChange={(e) => onChange({ multiLanguage: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Multi-language support</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.handoffToHuman}
              onChange={(e) => onChange({ handoffToHuman: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Human handoff</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const ABTestSettings: React.FC<{
  config: ABTestConfig;
  onChange: (updates: Partial<ABTestConfig>) => void;
}> = ({ config, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">A/B Testing Settings</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enable A/B Testing
          </label>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Confidence Level: {config.defaultConfidenceLevel}%
          </label>
          <input
            type="range"
            min="80"
            max="99"
            value={config.defaultConfidenceLevel}
            onChange={(e) => onChange({ defaultConfidenceLevel: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Sample Size: {config.minimumSampleSize}
          </label>
          <input
            type="range"
            min="50"
            max="1000"
            step="10"
            value={config.minimumSampleSize}
            onChange={(e) => onChange({ minimumSampleSize: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Test Duration: {config.maxTestDuration} days
          </label>
          <input
            type="range"
            min="7"
            max="90"
            value={config.maxTestDuration}
            onChange={(e) => onChange({ maxTestDuration: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exploration Rate: {config.explorationRate}
          </label>
          <input
            type="range"
            min="0.05"
            max="0.3"
            step="0.01"
            value={config.explorationRate}
            onChange={(e) => onChange({ explorationRate: parseFloat(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Rate of exploration in bandit testing</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statistical Rigor
          </label>
          <select
            value={config.statisticalRigor}
            onChange={(e) => onChange({ statisticalRigor: e.target.value as 'standard' | 'strict' | 'relaxed' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="relaxed">Relaxed (Faster results)</option>
            <option value="standard">Standard (Balanced)</option>
            <option value="strict">Strict (High confidence)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.banditEnabled}
              onChange={(e) => onChange({ banditEnabled: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Multi-armed bandit testing</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.autoWinnerSelection}
              onChange={(e) => onChange({ autoWinnerSelection: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Auto-select winners</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsSettings: React.FC<{
  config: AnalyticsConfig;
  onChange: (updates: Partial<AnalyticsConfig>) => void;
}> = ({ config, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">Analytics Settings</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enable Analytics
          </label>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tracking Level
          </label>
          <select
            value={config.trackingLevel}
            onChange={(e) => onChange({ trackingLevel: e.target.value as 'basic' | 'detailed' | 'comprehensive' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="basic">Basic (Essential metrics)</option>
            <option value="detailed">Detailed (Standard tracking)</option>
            <option value="comprehensive">Comprehensive (Full tracking)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Retention: {config.dataRetention} days
          </label>
          <input
            type="range"
            min="30"
            max="365"
            value={config.dataRetention}
            onChange={(e) => onChange({ dataRetention: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.realTimeUpdates}
              onChange={(e) => onChange({ realTimeUpdates: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Real-time updates</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.heatmapEnabled}
              onChange={(e) => onChange({ heatmapEnabled: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Heatmap tracking</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.performanceTracking}
              onChange={(e) => onChange({ performanceTracking: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Performance tracking</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.privacyMode}
              onChange={(e) => onChange({ privacyMode: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Privacy mode</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.anonymizeData}
              onChange={(e) => onChange({ anonymizeData: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Anonymize user data</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const GlobalSettings: React.FC<{
  config: GlobalAIConfig['globalSettings'];
  onChange: (updates: Partial<GlobalAIConfig['globalSettings']>) => void;
}> = ({ config, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">Global AI Settings</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Performance Mode
          </label>
          <select
            value={config.performanceMode}
            onChange={(e) => onChange({ performanceMode: e.target.value as 'balanced' | 'performance' | 'accuracy' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="performance">Performance (Fast, less accurate)</option>
            <option value="balanced">Balanced (Good speed and accuracy)</option>
            <option value="accuracy">Accuracy (Slower, more accurate)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Processing Mode
          </label>
          <select
            value={config.dataProcessingMode}
            onChange={(e) => onChange({ dataProcessingMode: e.target.value as 'realtime' | 'batch' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="realtime">Real-time (Immediate processing)</option>
            <option value="batch">Batch (Scheduled processing)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.debugMode}
              onChange={(e) => onChange({ debugMode: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Debug mode</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.fallbackMode}
              onChange={(e) => onChange({ fallbackMode: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Fallback mode (Use defaults on AI failure)</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.apiRateLimiting}
              onChange={(e) => onChange({ apiRateLimiting: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">API rate limiting</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default AISettingsDashboard;
