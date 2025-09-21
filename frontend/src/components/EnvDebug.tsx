import React from 'react';

export const EnvDebug: React.FC = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      background: 'yellow', 
      padding: '20px', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3>Environment Debug</h3>
      <p><strong>NODE_ENV:</strong> {import.meta.env.NODE_ENV}</p>
      <p><strong>MODE:</strong> {import.meta.env.MODE}</p>
      <p><strong>PROD:</strong> {import.meta.env.PROD ? 'true' : 'false'}</p>
      <p><strong>DEV:</strong> {import.meta.env.DEV ? 'true' : 'false'}</p>
      <p><strong>VITE_API_BASE_URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'undefined'}</p>
      <p><strong>All env vars:</strong></p>
      <pre style={{ fontSize: '10px', maxHeight: '100px', overflow: 'auto' }}>
        {JSON.stringify(import.meta.env, null, 2)}
      </pre>
    </div>
  );
};
