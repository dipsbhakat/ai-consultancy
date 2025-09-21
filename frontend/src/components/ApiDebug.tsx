import React, { useState, useEffect } from 'react';
import { apiClient, API_CONFIG } from '../lib/api';

export const ApiDebug: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setApiBaseUrl(API_CONFIG.BASE_URL);
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setStatus('Testing API connection...');
      setError('');
      
      // Test health endpoint first
      const healthResponse = await fetch(`${API_CONFIG.BASE_URL}/health`);
      if (!healthResponse.ok) {
        throw new Error(`Health check failed: ${healthResponse.status}`);
      }
      
      // Test testimonials endpoint
      const testimonialsResponse = await apiClient.get('/contact/testimonials');
      setStatus(`✅ API connection successful! Found ${Array.isArray(testimonialsResponse) ? testimonialsResponse.length : 0} testimonials`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setStatus('❌ API connection failed');
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '20px', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h3>API Debug Info</h3>
      <p><strong>Environment:</strong> {import.meta.env.PROD ? 'Production' : 'Development'}</p>
      <p><strong>API Base URL:</strong> {apiBaseUrl}</p>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      <button onClick={testApiConnection} style={{ marginTop: '10px' }}>
        Test Again
      </button>
    </div>
  );
};
