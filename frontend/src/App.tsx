import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminRouter, AuthProvider } from './admin';
import { MobileOptimization, MobileCTABar } from './components/MobileOptimization';

// Advanced Systems
import { PersonalizationProvider } from './components/PersonalizationEngine';
import { ABTestProvider } from './components/ABTestingFramework';
import { AnalyticsDashboard, AnalyticsHeatmap } from './components/AdvancedAnalytics';
import { PersonalizationDebugPanel } from './components/PersonalizationEngine';
import { ABTestDashboard } from './components/ABTestingFramework';
import { PerformanceDashboard } from './components/PerformanceOptimization';
import { DebugControlPanel } from './components/DebugControlPanel';

// Phase 3: AI-Powered Systems
import { AIPersonalizationProvider, AIDashboard } from './components/AIPersonalizationEngine';
import { AIChatbot } from './components/AIChatbot';
import { LeadScoringProvider, LeadScoreDashboard } from './components/AILeadScoring';
import { AISettingsDashboard } from './components/AISettingsDashboard';

// Phase 4: Enterprise AI Systems
import { EnterpriseAIProvider } from './components/EnterpriseAI';
import { BusinessIntelligenceDashboard } from './components/BusinessIntelligenceDashboard';
import { CompetitiveIntelligenceMonitor } from './components/CompetitiveIntelligenceMonitor';

// Production Systems
import { ProductionErrorBoundary, performanceMonitor } from './components/ProductionErrorBoundary';
import { securityManager } from './utils/security';
import { config } from './config/production';

// Initialize production systems
if (config.isProduction()) {
  securityManager.init();
  performanceMonitor.init();
}

function App() {
  return (
    <ProductionErrorBoundary>
      <PersonalizationProvider>
        <ABTestProvider>
          <AIPersonalizationProvider>
            <LeadScoringProvider>
              <EnterpriseAIProvider>
                <Router>
              <Routes>
                {/* Main website routes */}
                <Route path="/" element={
                  <Layout>
                    <HomePage />
                  </Layout>
                } />
                <Route path="/services" element={
                  <Layout>
                    <ServicesPage />
                  </Layout>
                } />
                <Route path="/testimonials" element={
                  <Layout>
                    <TestimonialsPage />
                  </Layout>
                } />
                <Route path="/contact" element={
                  <Layout>
                    <ContactPage />
                  </Layout>
                } />
                
                {/* Admin routes */}
                <Route path="/admin/*" element={
                  <AuthProvider>
                    <AdminRouter />
                  </AuthProvider>
                } />
              </Routes>
              
              {/* Mobile optimization components - global */}
              <MobileOptimization />
              <MobileCTABar />
              
              {/* Phase 3: AI-Powered Components */}
              <AIChatbot />
              
              {/* Advanced Analytics & Optimization Dashboards */}
              <DebugControlPanel />
              <AnalyticsDashboard />
              <AnalyticsHeatmap />
              <PersonalizationDebugPanel />
              <ABTestDashboard />
              <PerformanceDashboard />
              
              {/* Phase 3: AI Dashboards */}
              <AIDashboard />
              <LeadScoreDashboard />
              <AISettingsDashboard />
              
              {/* Phase 4: Enterprise AI Dashboards */}
              <BusinessIntelligenceDashboard />
              <CompetitiveIntelligenceMonitor />
                </Router>
              </EnterpriseAIProvider>
            </LeadScoringProvider>
          </AIPersonalizationProvider>
        </ABTestProvider>
      </PersonalizationProvider>
    </ProductionErrorBoundary>
  );
}export default App;
