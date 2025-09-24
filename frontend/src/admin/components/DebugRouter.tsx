import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const DebugRouter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 right-0 bg-red-500 text-white p-4 text-xs z-50 max-w-xs">
      <h3 className="font-bold">Router Debug</h3>
      <p><strong>Pathname:</strong> {location.pathname}</p>
      <p><strong>Search:</strong> {location.search}</p>
      <p><strong>Hash:</strong> {location.hash}</p>
      <div className="mt-2">
        <button 
          onClick={() => navigate('/admin/analytics')}
          className="bg-white text-red-500 px-2 py-1 mr-1 text-xs"
        >
          Analytics
        </button>
        <button 
          onClick={() => navigate('/admin/contacts')}
          className="bg-white text-red-500 px-2 py-1 text-xs"
        >
          Contacts
        </button>
      </div>
    </div>
  );
};
