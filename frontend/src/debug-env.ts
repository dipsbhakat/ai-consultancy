// Environment Debug Helper
console.log('🔧 Environment Debug Information:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('All VITE vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
console.log('Environment mode:', import.meta.env.MODE);
console.log('Is production:', import.meta.env.PROD);

// Test API URL construction
const getApiBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || 'https://ai-consultancy-backend-nodejs.onrender.com/api/v1';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
};

console.log('Computed API Base URL:', getApiBaseUrl());

export {};
