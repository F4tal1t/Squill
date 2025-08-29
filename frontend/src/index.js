import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Squill Frontend - Development Mode');
}

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measurement
if (process.env.NODE_ENV === 'production') {
  // Web Vitals reporting
  import('./reportWebVitals').then(({ default: reportWebVitals }) => {
    reportWebVitals(console.log);
  });
}