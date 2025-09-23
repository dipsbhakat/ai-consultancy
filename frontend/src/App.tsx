import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminRouter, AuthProvider } from './admin';
import { MobileOptimization, MobileCTABar } from './components/MobileOptimization';
import { ThemeProvider } from './design-system/ThemeProvider';
import { NotificationProvider } from './design-system/NotificationSystem';

// Production Systems
import { ProductionErrorBoundary } from './components/ProductionErrorBoundary';

function App() {
  return (
    <ProductionErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <NotificationProvider>
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
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </ProductionErrorBoundary>
  );
}

export default App;
